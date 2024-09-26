import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ProjectList from '../../components/ProjectList';
import { PROJECTS_QUERY } from '../../graphql/queries';

// Mock the ServicesList component
jest.mock('../../components/ServicesList', () => {
  return function MockServicesList({ projectId }) {
    return <div data-testid="services-list">Services for project {projectId}</div>;
  };
});

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    theme: {
      useToken: () => ({
        token: {
          colorBgTextHover: '#f0f0f0',
          colorBgContainer: '#ffffff',
        },
      }),
    },
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
            { 
              node: { 
                id: 'proj1', 
                name: 'Project 1',
                createdAt: '2023-05-01T10:00:00Z',
                updatedAt: '2023-05-02T11:00:00Z'
              } 
            },
            { 
              node: { 
                id: 'proj2', 
                name: 'Project 2',
                createdAt: '2023-05-03T09:00:00Z',
                updatedAt: '2023-05-04T14:00:00Z'
              } 
            },
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

  await waitFor(() => {
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
    expect(screen.getByText('Created: 1 May 2023 at 12:00')).toBeInTheDocument();
    expect(screen.getByText('Updated: 2 May 2023 at 13:00')).toBeInTheDocument();
  });
});

test('allows selecting a project', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectList />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });

  const viewServicesButton = screen.getAllByText('View Services')[0];
  fireEvent.click(viewServicesButton);

  expect(screen.getByTestId('services-list')).toBeInTheDocument();
  expect(screen.getByText(/Services for project proj1/)).toBeInTheDocument();
});