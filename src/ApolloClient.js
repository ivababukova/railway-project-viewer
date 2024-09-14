import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  fetch,
  credentials: 'include', // This line is important for CORS
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;