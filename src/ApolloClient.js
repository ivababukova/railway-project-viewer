import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";


const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
});


const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://backboard.railway.app',
    connectionParams: {
      authToken: process.env.REACT_APP_AUTH_TOKEN,
    },
  })
);


const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
    }
  }
});


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);


const client = new ApolloClient({
  uri: '/graphql',
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;