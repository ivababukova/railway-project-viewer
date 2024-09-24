import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { getToken } from './token.js';


const setUrl = () => {
  const url = process.env.RAILWAY_PUBLIC_DOMAIN || "http://localhost:4000";
  console.log("URL used is: ", url);
  return `${url}/graphql`;
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