/* eslint-disable no-console */
const axios = require('axios');
const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server-errors');
const { parseResolveInfo } = require('graphql-parse-resolve-info');
const { print } = require('graphql');
const { createQueryObject, getVariableTypes, removeNullVariables } = require('./utils');

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

  #transformToScalarTypes = [];

  #debug;

  /**
   * Creates an instance of GraphQLDataSource.
   * @param {String} url the URL to the graphQL server
   * @param {String} [schemaPrefix=''] schema prefix.
   * @param {[String]} [transformToScalarTypes=['']] Types will be transform to Scalar
   * @param {Boolean} [debug=false] debug enabled
   * The prefix will be removed from the graphql query before sending to the destination datasource
   * @memberof GraphQLDataSource
   */
  constructor(url, schemaPrefix = '', transformToScalarTypes = [], debug = false) {
    super();
    if (!url) {
      throw new Error('missing url');
    }

    this.baseURL = url;
    this.#prefix = schemaPrefix;
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
    const { query: gqlQuery, operationName, variables } = this.#parseQuery(info, type);

    return this.#executeOperation(gqlQuery, operationName, variables, headers);
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
    const query = info.operation;
    if (this.#debug) {
      console.log('[DEBUG] --- query:', print(query));
    }

    const declaredVariables = getVariableTypes(info.schema, query, this.#prefix);
    const filteredVariables = removeNullVariables(declaredVariables, parsedResolveInfoFragment.args);

    if (this.#debug) {
      console.log('[DEBUG] --- declaredVariables:', declaredVariables);
      console.log('[DEBUG] --- filteredVariables:', filteredVariables);
    }

    const queryObject = createQueryObject({
      input: parsedResolveInfoFragment,
      isTopLevel: true,
      type,
      prefix: this.#prefix,
      transformToScalarTypes: this.#transformToScalarTypes,
      declaredVariables: filteredVariables,
    });
    queryObject.variables = parsedResolveInfoFragment.args;
    // queryObject.variables = addNullVariables(declaredVariables, parsedResolveInfoFragment.args);
    return queryObject;
  }

  /**
   * Send query to the destination server
   * @param {Object} query GraphQL query payload
   * @param {String} operationName query or mutation name
   * @param {Object} variables operation variables
   * @param {Object} headers query headers
   * @returns
   */
  async #executeOperation(query, operationName, variables, headers) {
    try {
      const payload = {
        operationName,
        query,
        variables,
      };

      if (this.#debug) {
        console.log('[DEBUG] --- operationName:', operationName);
        console.log('[DEBUG] --- query:', JSON.stringify(query));
        console.log('[DEBUG] --- variables:', JSON.stringify(variables));
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
