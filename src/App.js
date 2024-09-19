import React, {useState} from 'react';
import { Layout, Typography } from 'antd';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import UserInfo from './components/UserInfo';
import ProjectList from './components/ProjectList';
import UserTokenInput from './components/UserTokenInput';
import { getToken } from './token.js';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [isTokenSet, setIsTokenSet] = useState(!!getToken());

  const handleTokenSet = () => {
    setIsTokenSet(true);
  };

  return (
    <ApolloProvider client={client}>
      <Layout className="layout">
        <Header>
          <Title level={3} style={{ color: 'white', margin: 10 }}>Railway Project Viewer</Title>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <UserTokenInput onTokenSet={handleTokenSet} />
            {isTokenSet && (
              <>
                <UserInfo />
                <ProjectList />
              </>
            )}
          </div>
        </Content>
      </Layout>
    </ApolloProvider>
  );
}

export default App;