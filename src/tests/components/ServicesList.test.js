import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ServicesList from '../../components/ServicesList';
import { ENVIRONMENTS_WITH_SERVICES_QUERY, SERVICE_CREATE_MUTATION } from '../../graphql/queries';


jest.mock('../../hooks/useServicesData', () => ({
  useServicesData: jest.fn((data) => {
    if (!data) return { servicesByType: {} };
    return {
      servicesByType: {
        'env1': { name: 'Production', services: [{ id: 'serv1', name: 'API', status: 'SUCCESS' }] },
        'env2': { name: 'Staging', services: [{ id: 'serv2', name: 'Frontend', status: 'FAILED' }] },
      }
    };
  })
}));

const mocks = [
  {
    request: {
      query: ENVIRONMENTS_WITH_SERVICES_QUERY,
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
        project: {
          services: {
            edges: [
              { node: { id: 'serv1', name: 'API', status: 'SUCCESS' } },
              { node: { id: 'serv2', name: 'Frontend', status: 'FAILED' } },
            ],
          },
        },
        deployments: {
          edges: [
            {
              node: {
                id: "dep1", 
                service: {id: 'serv1', name: 'API'},
                environment: {id: 'env1', name: 'Production'},
                createdAt: '2024-09-26T09:47:33.521Z',
                status: 'SUCCESS',
                updatedAt: "2024-09-26T09:48:53.248Z"
              }
            }
          ]
        }
      },
    },
  },
];

describe('ServicesList', () => {
  test('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServicesList projectId="proj1" />
      </MockedProvider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });


  test('renders error message when there is an error', async () => {
    const errorMock = [
      {
        request: {
          query: ENVIRONMENTS_WITH_SERVICES_QUERY,
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
      expect(screen.getByText(/Error loading data: An error occurred/)).toBeInTheDocument();
    });
  });


  test('opens modal when "Create New Service" button is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServicesList projectId="proj1" />
      </MockedProvider>
    );
  
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Create New Service')).toBeInTheDocument();
    });
  
    // Click the "Create New Service" button
    fireEvent.click(screen.getByText('Create New Service'));
  
    // Check if the modal is visible
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  
    // Check for elements inside the modal
    expect(screen.getByPlaceholderText('Service Name')).toBeInTheDocument();
    expect(screen.getByText('Repository')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
  });


  test('creates new service when form is submitted', async () => {
    const createServiceMock = jest.fn(() => ({ data: { serviceCreate: { id: 'new-service' } } }));
    const specificMocks = [
      ...mocks,
      {
        request: {
          query: SERVICE_CREATE_MUTATION,
          variables: {
            input: {
              name: 'New Service',
              projectId: 'proj1',
              source: { repo: 'https://github.com/example/repo' },
            },
          },
        },
        result: createServiceMock,
      },
    ];

    render(
      <MockedProvider mocks={specificMocks} addTypename={false}>
        <ServicesList projectId="proj1" />
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Create New Service'));
    });

    fireEvent.change(screen.getByPlaceholderText('Service Name'), { target: { value: 'New Service' } });
    fireEvent.change(screen.getByPlaceholderText('GitHub Repo URL'), { target: { value: 'https://github.com/example/repo' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Create'));
    });

    await waitFor(() => {
      expect(createServiceMock).toHaveBeenCalled();
      expect(screen.getByText('Service New Service created successfully!')).toBeInTheDocument();
    });
  });
});