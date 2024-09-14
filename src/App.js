import React from 'react';
import { Layout, Typography } from 'antd';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import UserInfo from './components/UserInfo';
import ProjectList from './components/ProjectList';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout className="layout">
        <Header>
          <Title level={3} style={{ color: 'white', margin: 10 }}>Railway Project Viewer</Title>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <UserInfo />
            <ProjectList />
          </div>
        </Content>
      </Layout>
    </ApolloProvider>
  );
}

export default App;