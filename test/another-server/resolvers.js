async function genericQuery(parent, args, context, info) {
  try {
    const { demoFederationAPI } = context.dataSources;
    const { secretToken } = context;
    const headers = {
      serviceSecret: secretToken,
    };

    const result = await demoFederationAPI.query(info, { headers });
    const data = result?.data || {};
    const keys = Object.keys(data);
    return data[keys[0]] || {};
  } catch (error) {
    console.log(('!!!! errorr', error));
    throw error;
  }
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
