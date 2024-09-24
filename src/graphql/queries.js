import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
    }
  }
`;

export const PROJECTS_QUERY = gql`
  query projects($userId: String) {
    projects(userId: $userId) {
      edges {
        node {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  }
`;

// todo: this is not used by anything and can be deleted
export const SERVICES_QUERY = gql`
  query GetProjectServices($projectId: String!) {
    project(id: $projectId) {
      services {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export const ENVIRONMENTS_WITH_SERVICES_QUERY = gql`
  query FetchEnvironmentsAndDeployments($projectId: String!) {
    environments(projectId: $projectId) {
      edges {
        node {
          id
          name
        }
      }
    }
    project(id: $projectId) {
      services {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    deployments(input: { projectId: $projectId }) {
      edges {
        node {
          id
          service {
            id
            name
          }
          environment {
            id
            name
          }
          createdAt
          status
          updatedAt
        }
      }
    }
  }
`;

export const SERVICE_CREATE_MUTATION = gql`
  mutation serviceCreate($input: ServiceCreateInput!) {
    serviceCreate(input: $input) {
      id
      name
      projectId
      createdAt
      updatedAt
      templateServiceId
      templateThreadSlug
      featureFlags
    }
  }
`;

export const SERVICE_DELETE_MUTATION = gql`
  mutation DeleteMutation($id: String!) {
    serviceDelete(id: $id)
  }
`;