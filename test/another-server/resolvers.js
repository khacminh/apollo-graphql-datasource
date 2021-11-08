function genericQuery(parent, args, context, info) {
  const { demoFederationAPI } = context.dataSources;
  const { secretToken } = context;
  const headers = {
    serviceSecret: secretToken,
  };

  return demoFederationAPI.query(info, { headers });
}

function genericMutation(parent, args, context, info) {
  const { demoFederationAPI } = context.dataSources;
  const { secretToken } = context;
  const headers = {
    serviceSecret: secretToken,
  };
  return demoFederationAPI.mutation(info, { headers });
}

module.exports = {
  Query: {
    Demo0me: (...params) => genericQuery(...params),
    Demo0topProducts: (...params) => genericQuery(...params),
  },
  Mutation: {
    Demo0doSth: (...params) => genericMutation(...params),
  },
};
