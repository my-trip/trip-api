import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    split,
  } from '@apollo/client/core'
  import { getMainDefinition } from '@apollo/client/utilities'
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
  
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    httpLink
  )
  
  const apolloClient = new ApolloClient({
    link: link,
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