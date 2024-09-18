import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';


const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
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
  cache: new InMemoryCache(),
});

export default client;