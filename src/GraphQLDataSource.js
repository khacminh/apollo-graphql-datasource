/* eslint-disable no-console */
const axios = require('axios');
const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server-errors');
const { parseResolveInfo } = require('graphql-parse-resolve-info');
const { print, buildSchema, parse } = require('graphql');
const { gql } = require('graphql-tag');
const { createQueryObject, findAllEnums, getPossibleEnumTypes } = require('./utils');

/**
 * @typedef { import('graphql/type').GraphQLResolveInfo } GraphQLResolveInfo
 * @typedef { import('graphql').DocumentNode} DocumentNode
 */

/**
 * Apollo GraphQL Data source
 *
 * @class GraphQLDataSource
 * @extends {DataSource}
 */
class GraphQLDataSource extends DataSource {
  #client;

  #prefix;

  #allEnums;

  #typeDefs;

  #schema;

  #transformToScalarTypes = [];

  #debug;

  /**
   * Creates an instance of GraphQLDataSource.
   * @param {String} url the URL to the graphQL server
   * @param {String} typeDefs typeDefs in String
   * @param {String} [schemaPrefix=''] schema prefix.
   * @param {[String]} [transformToScalarTypes=['']] Types will be transform to Scalar
   * @param {Boolean} [debug=false] debug enabled
   * The prefix will be removed from the graphql query before sending to the destination datasource
   * @memberof GraphQLDataSource
   */
  constructor(url, typeDefs, schemaPrefix = '', transformToScalarTypes = [], debug = false) {
    super();
    if (!url) {
      throw new Error('missing url');
    }

    this.baseURL = url;
    this.#prefix = schemaPrefix;
    this.#typeDefs = gql`${typeDefs}`;
    // this.#schema = makeExecutableSchema({ typeDefs }, {});
    this.#schema = buildSchema(typeDefs, { assumeValid: true });
    this.#allEnums = findAllEnums(this.#typeDefs);
    this.#transformToScalarTypes = transformToScalarTypes;
    this.#debug = debug;

    this.#client = axios.create({
      baseURL: url,
      timeout: 55000,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  initialize(config) {
    this.context = config.context;
  }

  /**
   * Execute the mutation
   *
   * @param {GraphQLResolveInfo} info GraphQLResolveInfo
   * @param {Object} options
   * @param {Object} options.headers additional headers
   * @returns {*} mutation result - HTTP JSON body
   * @memberof GraphQLDataSource
   */
  async mutation(info, options) {
    return this.#fetch(info, 'mutation', options);
  }

  /**
   * Execute the query
   *
   * @param {GraphQLResolveInfo} info GraphQLResolveInfo
   * @param {Object} options
   * @param {Object} options.headers additional headers
   * @returns {*} query result - HTTP JSON body
   * @memberof GraphQLDataSource
   */
  async query(info, options) {
    return this.#fetch(info, 'query', options);
  }

  /**
   *
   * @param {GraphQLResolveInfo} info GraphQLResolveInfo
   * @param {String} type Must be either **query** or **mutation**
   * @param {Object} options
   * @param {Object} options.headers additional headers
   * @returns query result
   */
  #fetch(info, type, options = {}) {
    if (!info) {
      throw new ApolloError('Missing query GraphQL Resolve Info');
    }

    const { headers } = options;
    const { query: gqlQuery, operationName } = this.#parseQuery(info, type);

    return this.#executeOperation(gqlQuery, operationName, headers);
  }

  /**
   *
   * @param {GraphQLResolveInfo} info GraphQLResolveInfo
   * @param {String} type Must be either **query** or **mutation**
   * @returns
   */
  #parseQuery(info, type) {
    const parsedResolveInfoFragment = parseResolveInfo(info);
    if (this.#debug) {
      console.log('[DEBUG] --- parseResolveInfo:', JSON.stringify(parsedResolveInfoFragment));
    }
    // const query = print(info.operation);
    const query = info.operation;
    if (this.#debug) {
      console.log('[DEBUG] --- query:', print(query));
    }

    const { query: rebuildQuery } = createQueryObject({
      input: parsedResolveInfoFragment,
      allEnums: this.#allEnums,
      possibleEnums: [],
      isTopLevel: true,
      type,
      prefix: '',
      transformToScalarTypes: this.#transformToScalarTypes,
    });

    if (this.#debug) {
      console.log('[DEBUG] --- rebuildQuery:', rebuildQuery);
    }

    const possibleEnums = getPossibleEnumTypes(info.schema, this.#allEnums, parse(rebuildQuery));

    if (this.#debug) {
      console.log('[DEBUG] --- all enums:', this.#allEnums);
      console.log('[DEBUG] --- possibleEnums:', possibleEnums);
    }

    const queryObject = createQueryObject({
      input: parsedResolveInfoFragment,
      allEnums: this.#allEnums,
      possibleEnums,
      isTopLevel: true,
      type,
      prefix: this.#prefix,
      transformToScalarTypes: this.#transformToScalarTypes,
    });
    return queryObject;
  }

  /**
   * Send query to the destination server
   * @param {Object} query GraphQL query payload
   * @param {Object} headers query headers
   * @returns
   */
  async #executeOperation(query, operationName, headers) {
    try {
      const payload = {
        operationName,
        query,
      };

      if (this.#debug) {
        console.log('[DEBUG] --- operationName:', operationName);
        console.log('[DEBUG] --- query:', JSON.stringify(query));
      }

      const response = await this.#client.post('/', payload, { headers });

      return response?.data || {};
    } catch (error) {
      const status = error?.response?.status || 'UNKNOWN';
      throw new ApolloError(`Data Source Error with status code: ${status}`);
    }
  }
}

module.exports = GraphQLDataSource;
