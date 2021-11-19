export type GraphQLResolveInfo = import('graphql/type').GraphQLResolveInfo;
export type DocumentNode = import('graphql').DocumentNode;
export type GraphQLSchema = import('graphql').GraphQLSchema;
export function createQueryObject({ input, allEnums, possibleEnums, isTopLevel, type, prefix, transformToScalarTypes }: {
    input: any;
    allEnums: any;
    possibleEnums: any;
    isTopLevel: any;
    type: any;
    prefix: any;
    transformToScalarTypes?: any[];
}): true | {
    __args: {};
    query?: undefined;
    operationName?: undefined;
} | {
    query: string;
    operationName: any;
    __args?: undefined;
};
/**
 *
 * @param {DocumentNode} typeDefs typeDefs
 * @returns
 */
export function findAllEnums(typeDefs: DocumentNode): any;
/**
 *
 * @param {GraphQLSchema} schema schema
 * @param {[Object]} allEnums all enums in the schema
 * @param {String} query GraphQL query
 * @returns Array of possibleEnums in the query
 */
export function getPossibleEnumTypes(schema: GraphQLSchema, allEnums: [any], query: string): any[];
