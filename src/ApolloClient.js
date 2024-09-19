import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { getToken } from './token.js';


const httpLink = new HttpLink({
  uri: "/graphql/v2",
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


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;