import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserTokenInput from '../../components/UserTokenInput';
import axios from 'axios';


jest.mock('axios');

describe('UserTokenInput', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.post.mockClear();
  });

  test('renders welcome message and form', () => {
    render(<UserTokenInput onTokenSet={() => {}} />);

    expect(screen.getByText('Welcome to Railway Project Viewer!')).toBeInTheDocument();
    expect(screen.getByText('Railway public API token')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your auth token')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Token' })).toBeInTheDocument();
  });

  test('submits token and calls onTokenSet on success', async () => {
    const onTokenSet = jest.fn();
    axios.post.mockResolvedValue({ data: { message: 'Token set successfully' } });

    render(<UserTokenInput onTokenSet={onTokenSet} />);

    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), {
      target: { value: 'valid-token' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        { token: 'valid-token' },
        { withCredentials: true }
      );
      expect(onTokenSet).toHaveBeenCalled();
    });
  });

  test('displays error message on invalid token', async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: 'Invalid token. Please try again.' } },
    });

    render(<UserTokenInput onTokenSet={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), {
      target: { value: 'invalid-token' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        { token: 'invalid-token' },
        { withCredentials: true }
      );
      expect(
        screen.getByText('Invalid token or server error. Please try again.')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your auth token')).toHaveValue('');
    });
  });

  test('requires token input', async () => {
    render(<UserTokenInput onTokenSet={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(
        screen.getByText('Please input your authentication token!')
      ).toBeInTheDocument();
    });
  });

  test('clears error message on successful submission', async () => {
    const onTokenSet = jest.fn();

    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid token. Please try again.' } },
    });

    render(<UserTokenInput onTokenSet={onTokenSet} />);

    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), {
      target: { value: 'invalid-token' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        { token: 'invalid-token' },
        { withCredentials: true }
      );
      expect(
        screen.getByText('Invalid token or server error. Please try again.')
      ).toBeInTheDocument();
    });

    axios.post.mockResolvedValueOnce({ data: { message: 'Token set successfully' } });

    fireEvent.change(screen.getByPlaceholderText('Enter your auth token'), {
      target: { value: 'valid-token' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Token' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        { token: 'valid-token' },
        { withCredentials: true }
      );
      expect(
        screen.queryByText('Invalid token or server error. Please try again.')
      ).not.toBeInTheDocument();
      expect(onTokenSet).toHaveBeenCalled();
    });
  });
});
