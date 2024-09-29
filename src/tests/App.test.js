import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from '../App';


jest.mock('../components/UserTokenInput', () => ({ onTokenSet }) => (
  <div data-testid="user-token-input">
    <button onClick={onTokenSet}>Set Token</button>
  </div>
));
jest.mock('../components/UserInfo', () => () => <div data-testid="user-info">User Info</div>);
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
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <App />
      </MockedProvider>
    );
    
    expect(screen.getByTestId('user-token-input')).toBeInTheDocument();
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-list')).not.toBeInTheDocument();
  });


  test('renders UserInfo and ProjectList after token is set', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <App />
      </MockedProvider>
    );

    // Initially, UserTokenInput should be present
    expect(screen.getByTestId('user-token-input')).toBeInTheDocument();
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-list')).not.toBeInTheDocument();

    // Simulate clicking the "Set Token" button to set the token
    fireEvent.click(screen.getByText('Set Token'));

    // Wait for UserInfo and ProjectList to appear
    await waitFor(() => {
      expect(screen.queryByTestId('user-token-input')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
      expect(screen.getByTestId('project-list')).toBeInTheDocument();
    });
  });
});