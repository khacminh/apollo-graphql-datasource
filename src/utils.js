const _ = require('lodash');
const { EnumType } = require('json-to-graphql-query');
const { TypeInfo, visitWithTypeInfo, visit, parse } = require('graphql');

/**
 * @typedef { import('graphql/type').GraphQLResolveInfo } GraphQLResolveInfo
 * @typedef { import('graphql').DocumentNode} DocumentNode
 * @typedef { import('graphql').GraphQLSchema} GraphQLSchema
 */

function checkIsEnum(name, value, allEnums, possibleEnums) {
  if (typeof value !== 'string') {
    return false;
  }

  const foundEnums = _.filter(possibleEnums, x => x.name === name);

  if (!foundEnums.length) {
    return false;
  }

  const foundTypes = _.map(foundEnums, 'type');
  return _.chain(allEnums)
    .filter(x => foundTypes.includes(x.type))
    .some(x => x.values.includes(value))
    .value();
}

function convertArgs(args, allEnums, possibleEnums) {
  if (_.isEmpty(args)) {
    return undefined;
  }
  const output = {};
  _.each(args, (value, key) => {
    output[key] = _.isObject(value) ? convertArgs(value)
      : checkIsEnum(key, value, allEnums, possibleEnums) ? new EnumType(value) : value;
  });
  return output;
}

function createQueryObject({ input, allEnums, possibleEnums, isTopLevel, type, prefix, transformToScalarTypes = [] }) {
  const { name, args, fieldsByTypeName } = input;
  const hasChildren = !_.isEmpty(fieldsByTypeName);
  const hasArgs = !_.isEmpty(args);

  const firstChildType = _.keys(fieldsByTypeName)[0];
  const shouldTransformToScalar = transformToScalarTypes.includes(firstChildType);

  if (!hasChildren || shouldTransformToScalar) {
    return hasArgs ? { __args: convertArgs(args) } : true;
  }

  const firstChild = fieldsByTypeName[_.keys(fieldsByTypeName)[0]];
  const output = {};

  _.each(firstChild, subchild => {
    output[subchild.name] = createQueryObject({ input: subchild, transformToScalarTypes });
  });

  if (isTopLevel) {
    const operationName = name.replace(new RegExp(prefix, 'g'), '');
    return {
      [type]: {
        __name: operationName || '',
        [operationName]: {
          ...output,
          __args: convertArgs(args, allEnums, possibleEnums),
        },
      },
    };
  }
  if (hasArgs) {
    output.__args = convertArgs(args);
  }
  return output;
}

/**
 *
 * @param {DocumentNode} typeDefs typeDefs
 * @returns
 */
function findAllEnums(typeDefs) {
  const enumDefs = _.filter(typeDefs.definitions, x => x.kind === 'EnumTypeDefinition');
  return _.map(enumDefs, val => ({
    type: val.name.value,
    values: _.chain(val.values)
      .filter(x => x.kind === 'EnumValueDefinition' && x.name.kind === 'Name')
      .map(x => x.name.value)
      .value(),
  }));
}

/**
 *
 * @param {GraphQLSchema} schema schema
 * @param {[Object]} allEnums all enums in the schema
 * @param {String} query GraphQL query
 * @returns Array of possibleEnums in the query
 */
function getPossibleEnumTypes(schema, allEnums, query) {
  const typeInfo = new TypeInfo(schema);
  const possibleEnums = [];
  const visitor = {
    enter(node) {
      const currentArgument = typeInfo.getArgument();

      const currentType = currentArgument?.type?.toString();
      const isEnum = !currentType ? false : _.some(allEnums, x => x.type === currentType);
      if (isEnum) {
        const currentName = currentArgument?.name;
        const currentItem = { name: currentName, type: currentType };
        const isItemExisted = _.some(possibleEnums, x => _.isEqual(x, currentItem));
        if (!isItemExisted) {
          possibleEnums.push(currentItem);
        }
      }

      typeInfo.enter(node);
    },
    leave(node) {
      typeInfo.leave(node);
    },
  };
  visit(parse(query), visitWithTypeInfo(typeInfo, visitor));
  return possibleEnums;
}

module.exports = {
  createQueryObject,
  findAllEnums,
  getPossibleEnumTypes,
};
