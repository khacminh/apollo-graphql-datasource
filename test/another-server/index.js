const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const typeDefs = require('./typeDefs');
const dataSources = require('./datasource');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs: gql`${typeDefs}`,
    resolvers,
  }]),
  dataSources,
  context: () => ({ secretToken: 'Super Secret' }),
  playground: true,
  introspection: true,

});

server.listen({ port: 4010 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
