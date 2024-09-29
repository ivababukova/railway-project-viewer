import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";


const setUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000/graphql';
  }
  return "https://project-viewer-server-production.up.railway.app/graphql";
}

const httpLink = new HttpLink({
  uri: setUrl(),
  credentials: 'include',
});


const cache = new InMemoryCache({
  addTypename: false,
});

const client = new ApolloClient({
  link: httpLink,
  cache: cache,
});

export default client;