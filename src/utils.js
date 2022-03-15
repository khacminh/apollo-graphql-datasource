const _ = require('lodash');
const { VariableType } = require('json-to-graphql-query');
const { TypeInfo, visitWithTypeInfo, visit } = require('graphql');
const { jsonToGraphQLQuery } = require('json-to-graphql-query');

let debug = false;

function setDebugFlag(isDebug) {
  debug = isDebug;
}

/**
 * @typedef { import('graphql/type').GraphQLResolveInfo } GraphQLResolveInfo
 * @typedef { import('graphql').DocumentNode} DocumentNode
 * @typedef { import('graphql').GraphQLSchema} GraphQLSchema
 */

function convertArgs(args, declaredVariables) {
  const output = {};

  _.each(args, (_value, key) => {
    const isDeclared = declaredVariables[key];
    if (isDeclared) {
      output[key] = new VariableType(key);
    }
  });
  return output;
}

function createQueryObject({ input, isTopLevel, type, prefix, transformToScalarTypes = [], declaredVariables = [] }) {
  const { name, args, fieldsByTypeName } = input;
  const hasChildren = !_.isEmpty(fieldsByTypeName);
  const hasArgs = !_.isEmpty(args);

  const firstChildType = _.keys(fieldsByTypeName)[0];
  const shouldTransformToScalar = transformToScalarTypes.includes(firstChildType);

  if (!isTopLevel && (!hasChildren || shouldTransformToScalar)) {
    return hasArgs ? { __args: convertArgs(args) } : true;
  }

  const firstChild = fieldsByTypeName[_.keys(fieldsByTypeName)[0]];
  const output = {};

  _.each(firstChild, subchild => {
    output[subchild.name] = createQueryObject({ input: subchild, transformToScalarTypes });
  });

  if (!isTopLevel) {
    if (hasArgs) {
      output.__args = convertArgs(args);
    }
    return output;
  }

  // Top level return
  const operationName = name.replace(new RegExp(prefix, 'g'), '');
  const queryObject = {
    [type]: {
      __name: operationName || '',
      [operationName]: {
        ...output,
        __args: convertArgs(args, declaredVariables),
      },
      __variables: declaredVariables,
    },
  };

  return {
    query: jsonToGraphQLQuery(queryObject),
    operationName,
  };
}

function getVariableTypes(schema, query, prefix = '') {
  const typeInfo = new TypeInfo(schema);
  const possibleVariables = {};

  const visitor = {
    enter(node) {
      const args = typeInfo.getArgument();
      if (args) {
        const { name: argName, defaultValue, type } = args;

        const hasVariable = !!possibleVariables[argName];
        if (!hasVariable) {
          const convertedType = `${type}`.replace(new RegExp(prefix, 'g'), '');
          if (defaultValue) {
            possibleVariables[argName] = `${convertedType} = "${defaultValue}"`;
          } else {
            possibleVariables[argName] = convertedType;
          }
        }
      }
      typeInfo.enter(node);
    },
    leave(node) {
      typeInfo.leave(node);
    },
  };
  visit(query, visitWithTypeInfo(typeInfo, visitor));
  return possibleVariables;
}

function addNullVariables(declaredVariables, variables) {
  const keys = _.keys(variables);
  const delcaredKeys = _.keys(declaredVariables);
  const returnVariables = _.cloneDeep(variables);

  _.each(delcaredKeys, delcaredKey => {
    const hasKey = keys.includes(delcaredKey);
    if (!hasKey) {
      returnVariables[delcaredKey] = null;
    }
  });

  return returnVariables;
}

function removeNullVariables(declaredVariables, variables) {
  const keys = _.compact(_.map(variables, (value, key) => (value ? key : null)));
  const delcaredKeys = _.keys(declaredVariables);
  const omitKeys = [];
  let returnVariables = _.cloneDeep(declaredVariables);

  _.each(delcaredKeys, delcaredKey => {
    const hasKey = keys.includes(delcaredKey);
    if (!hasKey) {
      omitKeys.push(delcaredKey);
    }
  });

  returnVariables = _.omit(returnVariables, omitKeys);
  return returnVariables;
}

module.exports = {
  setDebugFlag,
  getVariableTypes,
  createQueryObject,
  addNullVariables,
  removeNullVariables,
};
