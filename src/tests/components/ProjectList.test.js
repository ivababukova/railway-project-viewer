// tests/components/ProjectList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ProjectList } from '../../components/ProjectList';
import { PROJECTS_QUERY } from '../../graphql/queries';

// Mock the ServicesList component
jest.mock('../../components/ServicesList', () => {
  return function MockServicesList({ projectId }) {
    return <div data-testid="services-list">Services for project {projectId}</div>;
  };
});

const mocks = [
  {
    request: {
      query: PROJECTS_QUERY,
    },
    result: {
      data: {
        projects: {
          edges: [
            { node: { id: 'proj1', name: 'Project 1' } },
            { node: { id: 'proj2', name: 'Project 2' } },
          ],
        },
      },
    },
  },
];

test('renders project list when data is loaded', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectList />
    </MockedProvider>
  );

  expect(screen.getByText(/Loading.../)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Project 1/)).toBeInTheDocument();
    expect(screen.getByText(/Project 2/)).toBeInTheDocument();
  });
});

test('allows selecting a project', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectList />
    </MockedProvider>
  );

  await waitFor(() => {
    const viewServicesButtons = screen.getAllByText('View Services');
    fireEvent.click(viewServicesButtons[0]);
  });

  expect(screen.getByTestId('services-list')).toBeInTheDocument();
  expect(screen.getByText(/Services for project proj/)).toBeInTheDocument();
});