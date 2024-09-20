import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { getToken } from './token.js';


const setUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log("graphql url in development");
    return '/graphql/v2'
  }
  console.log("graphql url in production");
  return 'https://backboard.railway.app/graphql/v2';
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


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;