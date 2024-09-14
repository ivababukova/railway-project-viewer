// src/components/ProjectList.js
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { PROJECTS_QUERY } from '../graphql/queries';
import ServicesList from './ServicesList';

export function ProjectList() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Projects</h2>
      <ul>
        {data.projects.edges.map(({ node }) => (
          <li key={node.id}>
            {node.name} (ID: {node.id})
            <button onClick={() => setSelectedProjectId(node.id)}>
              View Services
            </button>
          </li>
        ))}
      </ul>
      {selectedProjectId && <ServicesList projectId={selectedProjectId} />}
    </div>
  );
}

export default ProjectList;