import { createApolloProvider } from '@vue/apollo-option'
import { setContext } from '@apollo/client/link/context';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { getStorageItem, setStorageItem, deleteStorageItem } from './utils/storage'
const cache = new InMemoryCache()

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getStorageItem('token');
  // return the headers to the context so httpLink can read them

  const newHeadersValue = {}

  if (token) {
    newHeadersValue.Authorization = `Bearer ${token}`
  }

  return {
    headers: {
      ...headers,
      ...newHeadersValue
    }
  }
});

const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

async function onLogin(data) {
  setStorageItem('token', data.token)
  setStorageItem('name', data.name)
  if (data.agency_name) {
    setStorageItem('agencyName', data.agency_name)
  }
  setStorageItem('email', data.email)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
async function onLogout() {
  deleteStorageItem('token')
  deleteStorageItem('name')
  deleteStorageItem('agencyName')
  deleteStorageItem('email')
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}

export { apolloProvider, onLogin, onLogout }