import React from 'react';
import { useQuery } from '@apollo/client';
import { Card, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ME_QUERY } from '../graphql/queries';

const { Meta } = Card;

function UserInfo() {
  const { loading, error, data } = useQuery(ME_QUERY);

  if (loading) return <Spin data-testid="loading-spinner"/>;
  if (error) return <p>Error loading user information: {error.message}</p>;

  return (
    <Card style={{ marginBottom: 16 }}>
      <Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={data.me.username}
        description={`User ID: ${data.me.id}`}
      />
    </Card>
  );
}

export default UserInfo;