import { createApolloProvider } from '@vue/apollo-option'
import { setContext } from '@apollo/client/link/context';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

const cache = new InMemoryCache()

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them

  if (token) {
    headers.authorization = `Bearer ${token}`
  }

  return headers
});

const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

async function onLogin(data) {
  if (typeof localStorage !== 'undefined' && data.token) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.name)
    localStorage.setItem('agencyName', data.agency_name)
    localStorage.setItem('email',data.email)
  }
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
async function onLogout() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token')
  }
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}

export { apolloProvider, onLogin, onLogout }