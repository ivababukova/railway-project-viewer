import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import UserInfo from './components/UserInfo';
import ProjectList from './components/ProjectList';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Railway Project Viewer</h1>
        <UserInfo />
        <ProjectList />
      </div>
    </ApolloProvider>
  );
}

export default App;