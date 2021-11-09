export = GraphQLDataSource;
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
declare class GraphQLDataSource extends DataSource<any> {
    /**
     * Creates an instance of GraphQLDataSource.
     * @param {String} url the URL to the graphQL server
     * @param {String} typeDefs typeDefs in String
     * @param {string} [schemaPrefix=''] schema prefix.
     * The prefix will be removed from the graphql query before sending to the destination datasource
     * @memberof GraphQLDataSource
     */
    constructor(url: string, typeDefs: string, schemaPrefix?: string);
    baseURL: string;
    context: any;
    /**
     * Execute the mutation
     *
     * @param {GraphQLResolveInfo} info GraphQLResolveInfo
     * @param {Object} options
     * @param {Object} options.headers additional headers
     * @returns {*} mutation result - HTTP JSON body
     * @memberof GraphQLDataSource
     */
    mutation(info: GraphQLResolveInfo, options: {
        headers: any;
    }): any;
    /**
     * Execute the query
     *
     * @param {GraphQLResolveInfo} info GraphQLResolveInfo
     * @param {Object} options
     * @param {Object} options.headers additional headers
     * @returns {*} query result - HTTP JSON body
     * @memberof GraphQLDataSource
     */
    query(info: GraphQLResolveInfo, options: {
        headers: any;
    }): any;
    #private;
}
declare namespace GraphQLDataSource {
    export { GraphQLResolveInfo, DocumentNode };
}
import { DataSource } from "apollo-datasource";
type GraphQLResolveInfo = import('graphql/type').GraphQLResolveInfo;
type DocumentNode = import('graphql').DocumentNode;
