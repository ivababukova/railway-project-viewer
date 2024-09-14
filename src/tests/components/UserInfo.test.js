// tests/components/UserInfo.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import UserInfo from '../../components/UserInfo';
import { ME_QUERY } from '../../graphql/queries';

const mocks = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: { id: '123', username: 'testuser' },
      },
    },
  },
];

test('renders user information when data is loaded', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UserInfo />
    </MockedProvider>
  );

  expect(await screen.findByText(/ID: 123/)).toBeInTheDocument();
  expect(screen.getByText(/Username: testuser/)).toBeInTheDocument();
});

test('renders loading state', () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <UserInfo />
    </MockedProvider>
  );

  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
});