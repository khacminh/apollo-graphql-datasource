const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const products = [
  {
    upc: '1',
    name: 'Table',
    price: 899,
    weight: 100,
  },
  {
    upc: '2',
    name: 'Couch',
    price: 1299,
    weight: 1000,
  },
  {
    upc: '3',
    name: 'Chair',
    price: 54,
    weight: 50,
  },
];

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5, status: ProductEnum): [Product]
  }
  extend type Mutation {
    doSth(first: Int = 2): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int

    calulatedField(inputArgs: SomeInput): Int
    calulatedField2(inputArgs: SomeInput!): CalulatedField2Response
  }

  enum ProductEnum {
    VALUE_1
    VALUE_2
  }

  input SomeInput {
    args1: Int
    args2: String!
  }

  type CalulatedField2Response {
    value1: Int
    value2: Int
    value3: String
  }
`;

const resolvers = {
  Product: {
    calulatedField() {
      return 111;
    },
    calulatedField2() {
      return {
        value1: 555,
        value2: 666,
        value3: 'Hello World',
      };
    },
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    },
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    },
  },
  Mutation: {
    doSth(_, args) {
      return products.slice(0, args.first);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
