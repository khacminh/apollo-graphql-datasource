// const GraphQLDataSource = require('../../src');
const GraphQLDataSource = require('appolo-graphql-datasource');
const typeDefs = require('./typeDefs');

const dataSource = new GraphQLDataSource(
  'http://localhost:4000/',
  typeDefs,
  'Demo0',
  [],
  true,
);

module.exports = () => ({
  demoFederationAPI: dataSource,
});
