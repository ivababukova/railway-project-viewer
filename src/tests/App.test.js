// tests/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from '../App';

test('renders Railway Project Viewer heading', () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <App />
    </MockedProvider>
  );
  const headingElement = screen.getByText(/Railway Project Viewer/i);
  expect(headingElement).toBeInTheDocument();
});