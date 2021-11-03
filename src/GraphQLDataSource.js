const axios = require('axios');
const gql = require('graphql-tag');
const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server-errors');
/**
 * @typedef { import('graphql/type').GraphQLResolveInfo } GraphQLResolveInfo
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

  /**
   * Creates an instance of GraphQLDataSource.
   * @param {String} url the URL to the graphQL server
   * @param {string} [schemaPrefix=''] schema prefix.
   * The prefix will be removed from the graphql query before sending to the destination datasource
   * @memberof GraphQLDataSource
   */
  constructor(url, schemaPrefix = '') {
    super();
    if (!url) {
      throw new Error('missing url');
    }

    this.baseURL = url;
    this.#prefix = schemaPrefix;

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
    return this.#fetch(info, options);
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
    return this.#fetch(info, options);
  }

  #fetch(info, options = {}) {
    if (!info) {
      throw new ApolloError('Missing query info');
    }

    const { headers } = options;
    const { gqlQuery, variables } = this.#parseQuery(info);
    return this.#executeOperation(gqlQuery, variables, headers);
  }

  #parseQuery(info) {
    const queryString = info.fieldNodes[0].loc.source.body;
    const { variableValues: variables } = info;
    const finalQueryString = !this.#prefix ? queryString
      : queryString.replace(new RegExp(this.#prefix, 'g'), '');
    const gqlQuery = gql`${finalQueryString}`;
    return { gqlQuery, variables };
  }

  async #executeOperation(query, variables, headers) {
    try {
      const payload = {
        query,
        variables: variables || {},
      };
      const response = await this.#client.post('/', payload, { headers });
      return response.data.data;
    } catch (error) {
      const { status } = error.response;
      throw new ApolloError(`Data Source Error with status code: ${status}`);
    }
  }
}

module.exports = GraphQLDataSource;
