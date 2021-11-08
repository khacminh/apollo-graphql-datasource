export type GraphQLResolveInfo = import('graphql/type').GraphQLResolveInfo;
export type DocumentNode = import('graphql').DocumentNode;
export function createQueryObject({ input, allEnums, possibleEnums, isTopLevel, type, prefix }: {
    input: any;
    allEnums: any;
    possibleEnums: any;
    isTopLevel: any;
    type: any;
    prefix: any;
}): true | {
    __args: {};
} | {
    [x: number]: {
        [x: number]: {
            __args: {};
        };
        __name: any;
    };
    __args?: undefined;
};
/**
 *
 * @param {DocumentNode} typeDefs typeDefs
 * @returns
 */
export function findAllEnums(typeDefs: DocumentNode): any;
export function getPossibleEnumTypes(schema: any, allEnums: any, query: any): any[];
