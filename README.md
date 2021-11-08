# apollo-graphql-datasource

Connect your GraphQL server to an existing GraphQL API using DataSources.

**Note: This is designed to work with  [Apollo Server 2.0](https://www.apollographql.com/docs/apollo-server/whats-new.html) and [Data Sources](https://www.apollographql.com/docs/apollo-server/features/data-sources.html)**

## GraphQL Data Source

### Install

```sh
npm i apollo-graphql-datasource --save
```

### Usage

Define a data source by creating new the `GraphQLDataSource` instance. The below example will create a GraphQL datasource to the [Apollo Federation Demo](https://github.com/apollographql/federation-demo) gateway. In the real world project, your schema may conflict with the destination schema. Therefore, a prefix should be added to the destination schema types, in this example: `Demo0`

```js
const GraphQLDataSource = require('appolo-graphql-datasource');
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Demo0Product {
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

  type CalulatedField2Response {
    value1: Int
    value2: Int
    value3: String
  }

  type Query {
    Demo0me: Demo0User
    Demo0topProducts(first: Int = 5, status: ProductEnum): [Demo0Product]
  }

  type Mutation {
    Demo0doSth(first: Int = 5): [Demo0Product]
  }
`;

const dataSource = new GraphQLDataSource(
  'http://federation.gateway.url/',
  typeDefs,
  'Demo0',
);
```

### GraphQL Operations

- The `query` and `mutation` methods on the `GraphQLDataSource` make a request to the GraphQL server. The datasource will **foward** the client's **query** to the destination server.
- The `query` and `mutation` methods accepts a second parameter, `options`, which can be used to pass the additional **headers**.
- The datasource also handles:
  - mutiple `queries` or `mutations` in one request
  - fragment
  - enum
  - fields with arguments

```js
async Demo0topProducts(parent, args, context, info) {
  const { demoFederationAPI } = context.dataSources;
  const { secretToken } = context;
  const headers = {
    serviceSecret: secretToken,
  };
  return demoFederationAPI.query(info, { headers });
}
```
