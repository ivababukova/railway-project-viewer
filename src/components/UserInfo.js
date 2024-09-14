import React from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../graphql/queries';

function UserInfo() {
  console.log('GraphQL API URL:', process.env.REACT_APP_GRAPHQL_API_URL);
  console.log('Auth Token:', process.env.REACT_APP_AUTH_TOKEN ? 'Set' : 'Not Set');

  const { loading, error, data } = useQuery(ME_QUERY);


  console.log("**** ", error);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>User Information</h2>
      <p>ID: {data.me.id}</p>
      <p>Username: {data.me.username}</p>
    </div>
  );
}

export default UserInfo;