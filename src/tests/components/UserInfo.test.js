// tests/components/UserInfo.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('UserInfo', () => {


  test('renders user information when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserInfo />
      </MockedProvider>
    );

    expect(await screen.findByText(/User ID: 123/)).toBeInTheDocument();
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
  });


  test('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <UserInfo />
      </MockedProvider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });


  test('renders error state', async () => {
    const errorMock = [
      {
        request: {
          query: ME_QUERY,
        },
        error: new Error('An error occurred'),
      },
    ];
  
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <UserInfo />
      </MockedProvider>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Error loading user information: An error occurred')).toBeInTheDocument();
    });
  });
});