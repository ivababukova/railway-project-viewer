import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import UserTokenInput from '../../components/UserTokenInput';
import { ME_QUERY } from '../../graphql/queries';
import * as tokenModule from '../../token.js';

// Mock the setToken function
jest.mock('../../token.js', () => ({
  setToken: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: { id: '1', email: 'test@example.com' },
      },
    },
  },
];

const errorMock = [
  {
    request: {
      query: ME_QUERY,
    },
    error: new Error('Invalid token'),
  },
];

describe('UserTokenInput', () => {
  test('renders welcome message and form', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserTokenInput onTokenSet={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByText('Welcome to Railway Project Viewer!')).toBeInTheDocument();
    expect(screen.getByText('Railway public API token')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your auth token')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Token' })).toBeInTheDocument();
  });


  test('submits token and calls onTokenSet on success', async () => {
    const onTokenSet = jest.fn();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserTokenInput onTokenSet={onTokenSet} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), { target: { value: 'valid-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(tokenModule.setToken).toHaveBeenCalledWith('valid-token');
      expect(onTokenSet).toHaveBeenCalled();
    });
  });


  test('displays error message on invalid token', async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <UserTokenInput onTokenSet={() => {}} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), { target: { value: 'invalid-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid token. Please try again.')).toBeInTheDocument();
      expect(tokenModule.setToken).toHaveBeenCalledWith('');
    });
  });


  test('requires token input', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserTokenInput onTokenSet={() => {}} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(screen.getByText('Please input your authentication token!')).toBeInTheDocument();
    });
  });


  test('clears error message on successful submission', async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <UserTokenInput onTokenSet={() => {}} />
      </MockedProvider>
    );

    // First, trigger an error
    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), { target: { value: 'invalid-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid token. Please try again.')).toBeInTheDocument();
    });

    // Then, submit a valid token
    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), { target: { value: 'valid-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(screen.queryByText('Invalid token. Please try again.')).not.toBeInTheDocument();
    });
  });
});