import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ServiceCard from '../../components/ServiceCard';
import { SERVICE_DELETE_MUTATION, SERVICE_DEPLOY_MUTATION } from '../../graphql/queries';

// Mock the message from antd
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

const mockService = {
  id: 'service1',
  name: 'Test Service',
  status: 'SUCCESS',
  updatedAt: '2023-05-01T10:00:00Z',
};

const mockEnvironments = [
  { envId: 'env1', name: 'Production' },
  { envId: 'env2', name: 'Staging' },
];

const mocks = [
  {
    request: {
      query: SERVICE_DELETE_MUTATION,
      variables: { id: 'service1' },
    },
    result: {
      data: {
        serviceDelete: { id: 'service1' },
      },
    },
  },
  {
    request: {
      query: SERVICE_DEPLOY_MUTATION,
      variables: { serviceId: 'service1', environmentId: 'env1' },
    },
    result: {
      data: {
        serviceDeploy: { id: 'deployment1' },
      },
    },
  },
];

describe('ServiceCard', () => {
  test('renders service information correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServiceCard service={mockService} environments={mockEnvironments} color="#ffffff" refetchFunc={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('ID:')).toBeInTheDocument();
    expect(screen.getByText('service1')).toBeInTheDocument();
    expect(screen.getByText('Last Deployment Status: SUCCESS')).toBeInTheDocument();
  });


  test('renders delete and deploy buttons', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServiceCard service={mockService} environments={mockEnvironments} color="#ffffff" refetchFunc={() => {}} />
      </MockedProvider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    const deployButton = screen.getByRole('button', { name: /caret-right/i });
    expect(deployButton).toBeInTheDocument();
  });


  test('triggers delete confirmation on delete button click', async () => {
    const refetchMock = jest.fn();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServiceCard service={mockService} environments={mockEnvironments} color="#ffffff" refetchFunc={refetchMock} />
      </MockedProvider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Wait for the Popconfirm to appear
    await waitFor(() => {
      expect(screen.getByText('Delete Service')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this service?')).toBeInTheDocument();
    });

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalled();
    });
  });


  test('handles service status changes', () => {
    const { rerender } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServiceCard service={{ ...mockService, status: 'FAILED' }} environments={mockEnvironments} color="#ffffff" refetchFunc={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByText('Last Deployment Status: FAILED')).toBeInTheDocument();

    rerender(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ServiceCard service={{ ...mockService, status: 'BUILDING' }} environments={mockEnvironments} color="#ffffff" refetchFunc={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByText('Last Deployment Status: BUILDING')).toBeInTheDocument();
  });
});