const _ = require('lodash');
const { jsonToGraphQLQuery, EnumType } = require('json-to-graphql-query');
const { TypeInfo, parse, visit, visitWithTypeInfo } = require('graphql');

const aa = 'Methyl salicylate 10% Topical Cream\nTitanium dioxide 0.13 mg /3.5mg Topical Lipstick\nDiclofenac sodium 75 mg Delayed Release Oral Tablet [Voltaren]\nEthanol 20% Topical Gel';

const data1 = { name: 'Demo0me', alias: 'Demo0me', args: {}, fieldsByTypeName: { Demo0User: { id: { name: 'id', alias: 'id', args: {}, fieldsByTypeName: {} }, name: { name: 'name', alias: 'name', args: {}, fieldsByTypeName: {} }, username: { name: 'username', alias: 'username', args: {}, fieldsByTypeName: {} }, reviews: { name: 'reviews', alias: 'reviews', args: {}, fieldsByTypeName: { Demo0Review: { id: { name: 'id', alias: 'id', args: {}, fieldsByTypeName: {} }, body: { name: 'body', alias: 'body', args: {}, fieldsByTypeName: {} }, product: { name: 'product', alias: 'product', args: {}, fieldsByTypeName: { Demo0Product: { upc: { name: 'upc', alias: 'upc', args: {}, fieldsByTypeName: {} }, name: { name: 'name', alias: 'name', args: {}, fieldsByTypeName: {} } } } } } } } } } };
const data2 = { name: 'Demo0topProducts', alias: 'Demo0topProducts', args: { first: 3, status: 'VALUE_2' }, fieldsByTypeName: { Demo0Product: { upc: { name: 'upc', alias: 'upc', args: {}, fieldsByTypeName: {} }, name: { name: 'name', alias: 'name', args: {}, fieldsByTypeName: {} } } } };
const data3 = { name: 'Demo0me', alias: 'Demo0me', args: {}, fieldsByTypeName: { Demo0User: { id: { name: 'id', alias: 'id', args: {}, fieldsByTypeName: {} }, name: { name: 'name', alias: 'name', args: {}, fieldsByTypeName: {} }, username: { name: 'username', alias: 'username', args: {}, fieldsByTypeName: {} }, reviews: { name: 'reviews', alias: 'reviews', args: { first: 1 }, fieldsByTypeName: { Demo0Review: { id: { name: 'id', alias: 'id', args: {}, fieldsByTypeName: {} }, body: { name: 'body', alias: 'body', args: {}, fieldsByTypeName: {} }, product: { name: 'product', alias: 'product', args: {}, fieldsByTypeName: { Demo0Product: { upc: { name: 'upc', alias: 'upc', args: {}, fieldsByTypeName: {} }, name: { name: 'name', alias: 'name', args: {}, fieldsByTypeName: {} } } } } } } } } } };
const data4 = { name: 'Demo0topProducts', alias: 'Demo0topProducts', args: { first: 3, status: 'VALUE_2' }, fieldsByTypeName: { Demo0Product: { upc: { name: 'upc', alias: 'upc', args: {}, fieldsByTypeName: {} }, name: { name: 'name', alias: 'name', args: {}, fieldsByTypeName: {} }, calulatedField: { name: 'calulatedField', alias: 'calulatedField', args: { inputArgs: { args1: 111, args2: 'AAA\nBBB' } }, fieldsByTypeName: {} }, calulatedField2: { name: 'calulatedField2', alias: 'calulatedField2', args: { inputArgs: { args1: 456, args2: aa } }, fieldsByTypeName: { CalulatedField2Response: { value1: { name: 'value1', alias: 'value1', args: {}, fieldsByTypeName: {} }, value3: { name: 'value3', alias: 'value3', args: {}, fieldsByTypeName: {} } } } } } } };
const _schema = {
  kind: 'Document',
  definitions: [
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Demo0Product',
      },
      interfaces: [],
      directives: [],
      fields: [{
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'upc',
        },
        arguments: [],
        type: {
          kind: 'NonNullType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'name',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'String',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'price',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'weight',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'reviews',
        },
        arguments: [],
        type: {
          kind: 'ListType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Demo0Review',
            },
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'inStock',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Boolean',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'shippingEstimate',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'calulatedField',
        },
        arguments: [{
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'inputArgs',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SomeInput',
            },
          },
          directives: [],
        }],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'calulatedField2',
        },
        arguments: [{
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'inputArgs',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'SomeInput',
              },
            },
          },
          directives: [],
        }],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'CalulatedField2Response',
          },
        },
        directives: [],
      }],
    }, {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Demo0Review',
      },
      interfaces: [],
      directives: [],
      fields: [{
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'id',
        },
        arguments: [],
        type: {
          kind: 'NonNullType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'body',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'String',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'author',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Demo0User',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'product',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Demo0Product',
          },
        },
        directives: [],
      }],
    }, {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Demo0User',
      },
      interfaces: [],
      directives: [],
      fields: [{
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'id',
        },
        arguments: [],
        type: {
          kind: 'NonNullType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'name',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'String',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'username',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'String',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'reviews',
        },
        arguments: [],
        type: {
          kind: 'ListType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Demo0Review',
            },
          },
        },
        directives: [],
      }],
    }, {
      kind: 'EnumTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ProductEnum',
      },
      directives: [],
      values: [{
        kind: 'EnumValueDefinition',
        name: {
          kind: 'Name',
          value: 'VALUE_1',
        },
        directives: [],
      }, {
        kind: 'EnumValueDefinition',
        name: {
          kind: 'Name',
          value: 'VALUE_2',
        },
        directives: [],
      }],
    }, {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SomeInput',
      },
      directives: [],
      fields: [{
        kind: 'InputValueDefinition',
        name: {
          kind: 'Name',
          value: 'args1',
        },
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'InputValueDefinition',
        name: {
          kind: 'Name',
          value: 'args2',
        },
        type: {
          kind: 'NonNullType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
        },
        directives: [],
      }],
    }, {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CalulatedField2Response',
      },
      interfaces: [],
      directives: [],
      fields: [{
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'value1',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'value2',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'value3',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'String',
          },
        },
        directives: [],
      }],
    }, {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Query',
      },
      interfaces: [],
      directives: [],
      fields: [{
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'Demo0me',
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Demo0User',
          },
        },
        directives: [],
      }, {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'Demo0topProducts',
        },
        arguments: [{
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'first',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          defaultValue: {
            kind: 'IntValue',
            value: '5',
          },
          directives: [],
        }, {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'status',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ProductEnum',
            },
          },
          directives: [],
        }],
        type: {
          kind: 'ListType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Demo0Product',
            },
          },
        },
        directives: [],
      }],
    }, {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Mutation',
      },
      interfaces: [],
      directives: [],
      fields: [{
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'Demo0doSth',
        },
        arguments: [{
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'first',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          defaultValue: {
            kind: 'IntValue',
            value: '5',
          },
          directives: [],
        }],
        type: {
          kind: 'ListType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Demo0Product',
            },
          },
        },
        directives: [],
      }],
    }],
  loc: {
    start: 0,
    end: 870,
  },
};

function findAllEnums(schema = _schema) {
  const enumDefs = _.filter(schema.definitions, x => x.kind === 'EnumTypeDefinition');
  const allEnums = _.each(enumDefs, val => allEnums.push({
    name: val.name.value,
    values: _.chain(val.values)
      .filter(x => x.kind === 'EnumValueDefinition' && x.name.kind === 'Name')
      .map(x => x.name.value)
      .value(),
  }));
}

function getEnumTypes(query) {
  const typeInfo = new TypeInfo(schema);
  const possibleEnums = [];
  const visitor = {
    enter(node) {
      const currentArgument = typeInfo.getArgument();

      const currentType = currentArgument?.type?.toString();
      const isEnum = !currentType ? false : _.some(enums, x => x.name === currentType);
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

function checkIsEnum(name, value, possibleEnums, allEnums) {
  if (typeof value !== 'string') {
    return false;
  }

  const foundEnums = _.filter(possibleEnums, x => x.name === name);

  if (!foundEnums.length) {
    return false;
  }

  const foundTypes = _.map(foundEnums, 'type');
  return _.chain(allEnums)
    .filter(x => foundTypes.includes(x.name))
    .some(x => x.values.includes(value))
    .value();
}

function convertArgs(args) {
  if (_.isEmpty(args)) {
    return undefined;
  }
  const output = {};
  _.each(args, (value, key) => {
    output[key] = _.isObject(value) ? convertArgs(value)
      : checkIsEnum(value) ? new EnumType(value) : value;
  });
  return output;
}

function createQueryObject({ input, isTopLevel, type, prefix, transformToIDTypes = [] }) {
  const { name, args, fieldsByTypeName } = input;
  const hasChildren = !_.isEmpty(fieldsByTypeName);
  const hasArgs = !_.isEmpty(args);

  const firstChildType = _.keys(fieldsByTypeName)[0];
  const shouldTransformToID = transformToIDTypes.includes(firstChildType);
  if (!hasChildren || shouldTransformToID) {
    return hasArgs ? { __args: convertArgs(args) } : true;
  }

  const firstChild = fieldsByTypeName[firstChildType];
  const output = {};

  _.each(firstChild, subchild => {
    output[subchild.name] = createQueryObject({
      input: subchild,
      transformToIDTypes,
    });
  });

  if (isTopLevel) {
    const operationName = name.replace(new RegExp(prefix, 'g'), '');
    const queryObject = {
      [type]: {
        __name: operationName || '',
        [operationName]: {
          ...output,
          __args: convertArgs(args),
        },
      },
    };
    return {
      queryObject,
      operationName,
    };
  }

  if (hasArgs) {
    output.__args = convertArgs(args);
  }

  return output;
}

const { queryObject, operationName } = createQueryObject({
  input: data4,
  isTopLevel: true,
  type: 'query',
  prefix: 'Demo0',
  transformToIDTypes: ['CalulatedField2Response'],
}); // ?

jsonToGraphQLQuery(queryObject); // ?
