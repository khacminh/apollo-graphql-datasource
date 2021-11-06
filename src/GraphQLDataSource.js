const axios = require('axios');
const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server-errors');
const { parseResolveInfo } = require('graphql-parse-resolve-info');
const { jsonToGraphQLQuery } = require('json-to-graphql-query');
const { print } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
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

  /**
   * Creates an instance of GraphQLDataSource.
   * @param {String} url the URL to the graphQL server
   * @param {DocumentNode} typeDefs typeDefs
   * @param {string} [schemaPrefix=''] schema prefix.
   * The prefix will be removed from the graphql query before sending to the destination datasource
   * @memberof GraphQLDataSource
   */
  constructor(url, typeDefs, schemaPrefix = '') {
    super();
    if (!url) {
      throw new Error('missing url');
    }

    this.baseURL = url;
    this.#prefix = schemaPrefix;
    this.#typeDefs = typeDefs;
    this.#schema = makeExecutableSchema({ typeDefs });
    this.#allEnums = findAllEnums(typeDefs);

    this.#client = axios.create({
      baseURL: url,
      timeout: 55000,
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
   * @returns {*} mutation result
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
   * @returns {*} query result
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
    const gqlQuery = this.#parseQuery(info, type);

    return this.#executeOperation(gqlQuery, headers);
  }

  /**
   *
   * @param {GraphQLResolveInfo} info GraphQLResolveInfo
   * @param {String} type Must be either **query** or **mutation**
   * @returns
   */
  #parseQuery(info, type) {
    const parsedResolveInfoFragment = parseResolveInfo(info);
    // const parsedResolveInfoFragment = info;
    const query = print(info.operation);
    const possibleEnums = getPossibleEnumTypes(this.#schema, this.#allEnums, query);

    const queryObject = createQueryObject({
      input: parsedResolveInfoFragment,
      allEnums: this.#allEnums,
      possibleEnums,
      isTopLevel: true,
      type,
      prefix: this.#prefix,
    });
    return jsonToGraphQLQuery(queryObject);
  }

  /**
   * Send query to the destination server
   * @param {Object} query GraphQL query payload
   * @param {Object} headers query headers
   * @returns
   */
  async #executeOperation(query, headers) {
    try {
      const response = await this.#client.post('/', { query }, { headers });
      const data = response?.data?.data || {};
      const keys = Object.keys(data);
      return data[keys[0]] || {};
    } catch (error) {
      const { status } = error.response;
      throw new ApolloError(`Data Source Error with status code: ${status}`);
    }
  }
}

module.exports = GraphQLDataSource;
