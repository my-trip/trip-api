// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'my-app',
      // URL to the GraphQL API
      // url: 'http://localhost:8080/graphql',
    },
    // Files processed by the extension
    includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql,graphql}'],
  },
}
