// tests/components/ServicesList.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ServicesList from '../../components/ServicesList';
import { ENVIRONMENTS_QUERY, DEPLOYMENTS_QUERY } from '../../graphql/queries';

const mocks = [
  {
    request: {
      query: ENVIRONMENTS_QUERY,
      variables: { projectId: 'proj1' },
    },
    result: {
      data: {
        environments: {
          edges: [
            { node: { id: 'env1', name: 'Production' } },
            { node: { id: 'env2', name: 'Staging' } },
          ],
        },
      },
    },
  },
  {
    request: {
      query: DEPLOYMENTS_QUERY,
      variables: { input: { projectId: 'proj1' } },
    },
    result: {
      data: {
        deployments: {
          edges: [
            { 
              node: { 
                id: 'dep1', 
                service: { id: 'serv1', name: 'API' },
                environment: { id: 'env1', name: 'Production' }
              } 
            },
            { 
              node: { 
                id: 'dep2', 
                service: { id: 'serv2', name: 'Frontend' },
                environment: { id: 'env2', name: 'Staging' }
              } 
            },
          ],
        },
      },
    },
  },
];

test('renders services list when data is loaded', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ServicesList projectId="proj1" />
    </MockedProvider>
  );

  // Check for initial loading state
  expect(screen.getByText(/Loading.../)).toBeInTheDocument();

  // Wait for both queries to complete and data to be processed
  await waitFor(() => {
    expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument();
  }, { timeout: 3000 });

  // Now check if everything is rendered correctly
  expect(screen.getByText('Services by Environment')).toBeInTheDocument();
  expect(screen.getByText('Production')).toBeInTheDocument();
  expect(screen.getByText('Staging')).toBeInTheDocument();
  expect(screen.getByText(/API/)).toBeInTheDocument();
  expect(screen.getByText(/Frontend/)).toBeInTheDocument();
});

test('renders error message when there is an error', async () => {
  const errorMock = [
    {
      request: {
        query: ENVIRONMENTS_QUERY,
        variables: { projectId: 'proj1' },
      },
      error: new Error('An error occurred'),
    },
  ];

  render(
    <MockedProvider mocks={errorMock} addTypename={false}>
      <ServicesList projectId="proj1" />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Error loading environments:/)).toBeInTheDocument();
  });
});

test('renders no services message when environment has no services', async () => {
  const noServicesMock = [
    {
      request: {
        query: ENVIRONMENTS_QUERY,
        variables: { projectId: 'proj1' },
      },
      result: {
        data: {
          environments: {
            edges: [
              { node: { id: 'env1', name: 'Empty Environment' } },
            ],
          },
        },
      },
    },
    {
      request: {
        query: DEPLOYMENTS_QUERY,
        variables: { input: { projectId: 'proj1' } },
      },
      result: {
        data: {
          deployments: {
            edges: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={noServicesMock} addTypename={false}>
      <ServicesList projectId="proj1" />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Empty Environment')).toBeInTheDocument();
    expect(screen.getByText('No services in this environment.')).toBeInTheDocument();
  });
});