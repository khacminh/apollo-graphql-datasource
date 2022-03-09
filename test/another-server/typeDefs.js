const { gql } = require('apollo-server');

const typeDefsWithPrefix = `
  type Demo0Product @key(fields: "id") {
    upc: String!
    name: String
    price: Int
    weight: Int
    reviews: [Demo0Review]
    inStock: Boolean
    shippingEstimate: Int

    calulatedField(inputArgs: SomeInput): Int
    calulatedField2(inputArgs: SomeInput!): CalulatedField2Response
  }

  type Demo0Review {
    id: ID!
    body: String
    author: Demo0User
    product: Demo0Product
  }

  type Demo0User {
    id: ID!
    name: String
    username: String
    reviews: [Demo0Review]
  }

  enum ProductEnum {
    VALUE_1
    VALUE_2
  }

  input SomeInput {
    args1: Int
    args2: String!
  }

  input topProductFilter {
    status: ProductEnum
  }

  type CalulatedField2Response {
    value1: Int
    value2: Int
    value3: String
  }

  type Query {
    Demo0me: Demo0User
    Demo0topProducts(first: Int = 5, status: ProductEnum): [Demo0Product]
    Demo0topProducts2(first: Int = 5, filter: topProductFilter): [Demo0Product]
  }

  type Mutation {
    Demo0doSth(first: Int = 5): [Demo0Product]
  }
`;

const typeDefsWithoutPrefix = gql`
  type Product {
    upc: String!
    name: String
    price: Int
    weight: Int
    reviews: [Review]
    inStock: Boolean
    shippingEstimate: Int
  }

  type Review {
    id: ID!
    body: String
    author: User
    product: Product
  }

  type User {
    id: ID!
    name: String
    username: String
    reviews: [Review]
  }

  type Query {
    me: User
    topProducts(first: Int = 5): [Product]
  }

  type Mutation {
    doSth(first: Int = 5): [Product]
  }
`;

module.exports = typeDefsWithPrefix;
