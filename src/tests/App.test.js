import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from '../App';
import * as tokenModule from '../token.js';


jest.mock('../components/UserTokenInput', () => ({ onTokenSet }) => (
  <div data-testid="user-token-input">
    <button onClick={onTokenSet}>Set Token</button>
  </div>
));jest.mock('../components/UserInfo', () => () => <div data-testid="user-info">User Info</div>);
jest.mock('../components/ProjectList', () => () => <div data-testid="project-list">Project List</div>);


describe('App Component', () => {
  test('renders Railway Project Viewer heading', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <App />
      </MockedProvider>
    );
    const headingElements = screen.getAllByText(/Railway Project Viewer/i);
    expect(headingElements.length).toBe(1);
  });


  test('renders UserTokenInput when token is not set', () => {
    jest.spyOn(tokenModule, 'getToken').mockReturnValue(null);
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <App />
      </MockedProvider>
    );
    
    expect(screen.getByTestId('user-token-input')).toBeInTheDocument();
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-list')).not.toBeInTheDocument();
  });


  test('renders UserInfo and ProjectList when token is set', () => {
    jest.spyOn(tokenModule, 'getToken').mockReturnValue('some-token');
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <App />
      </MockedProvider>
    );
    
    expect(screen.queryByTestId('user-token-input')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
    expect(screen.getByTestId('project-list')).toBeInTheDocument();
  });


  test('updates view when token is set', async () => {
    jest.spyOn(tokenModule, 'getToken').mockReturnValue(null);
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <App />
      </MockedProvider>
    );
    
    expect(screen.getByTestId('user-token-input')).toBeInTheDocument();

    // Simulate token being set
    act(() => {
      const setTokenButton = screen.getByText('Set Token');
      setTokenButton.click();
    });

    // Wait for the state to update
    await screen.findByTestId('user-info');

    expect(screen.queryByTestId('user-token-input')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
    expect(screen.getByTestId('project-list')).toBeInTheDocument();
  });
});