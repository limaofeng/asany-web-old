module.exports = {
  client: {
    includes: ['./src/**/*.gql'],
    service: {
      name: 'Test Environment',
      url: process.env.GRAPHQL_URL,
    },
  },
};
