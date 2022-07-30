import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from '@apollo/client/core'
  import fetch from 'cross-fetch'
  
  const { HASURA_URL, HASURA_SECRET } = process.env
  
  const headers = {
    'x-hasura-admin-secret': HASURA_SECRET,
  }
  
  const httpLink = new HttpLink({
    uri: HASURA_URL,
    headers,
    fetch,
  })
  
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })
  
  export { apolloClient as HasuraService }