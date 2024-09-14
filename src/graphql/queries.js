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
        }
      }
    }
  }
`;

export const ENVIRONMENTS_QUERY = gql`
  query FetchEnvironments($projectId: String!) {
    environments(projectId: $projectId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const DEPLOYMENTS_QUERY = gql`
  query FetchDeployments($input: DeploymentListInput!) {
    deployments(input: $input) {
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
        }
      }
    }
  }
`;
