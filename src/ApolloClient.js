import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { getToken } from './token.js';


const setUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000/graphql'; // Replace with your server's development URL
  }
  return '/graphql';
}

const httpLink = new HttpLink({
  uri: setUrl(),
});



const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const cache = new InMemoryCache({
  addTypename: false,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});

console.log("***** CLIENT: ", client);

export default client;