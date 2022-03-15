export type GraphQLResolveInfo = import('graphql/type').GraphQLResolveInfo;
export type DocumentNode = import('graphql').DocumentNode;
export type GraphQLSchema = import('graphql').GraphQLSchema;
export function setDebugFlag(isDebug: any): void;
export function getVariableTypes(schema: any, query: any, prefix?: string): {};
export function createQueryObject({ input, isTopLevel, type, prefix, transformToScalarTypes, declaredVariables }: {
    input: any;
    isTopLevel: any;
    type: any;
    prefix: any;
    transformToScalarTypes?: any[];
    declaredVariables?: any[];
}): true | {
    __args: {};
    query?: undefined;
    operationName?: undefined;
} | {
    query: string;
    operationName: any;
    __args?: undefined;
};
export function addNullVariables(declaredVariables: any, variables: any): any;
export function removeNullVariables(declaredVariables: any, variables: any): any;
