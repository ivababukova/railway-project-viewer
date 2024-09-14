import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ENVIRONMENTS_QUERY, DEPLOYMENTS_QUERY } from '../graphql/queries';

const ServicesList = ({ projectId }) => {
  const [services, setServices] = useState({});

  const { data: environmentsData, loading: environmentsLoading, error: environmentsError } = useQuery(ENVIRONMENTS_QUERY, {
    variables: { projectId },
  });

  const { data: deploymentsData, loading: deploymentsLoading, error: deploymentsError } = useQuery(DEPLOYMENTS_QUERY, {
    variables: { input: { projectId } },
    skip: !environmentsData,
  });

  useEffect(() => {
    if (environmentsData && deploymentsData) {
      const newServices = {};
      environmentsData.environments.edges.forEach(({ node: environment }) => {
        const environmentServices = deploymentsData.deployments.edges
          .filter(({ node }) => node.environment.id === environment.id)
          .map(({ node }) => node.service)
          .filter((service, index, self) => 
            index === self.findIndex((t) => t.id === service.id)
          );
        newServices[environment.id] = environmentServices;
      });
      setServices(newServices);
    }
  }, [environmentsData, deploymentsData]);

  if (environmentsLoading || deploymentsLoading) return <p>Loading...</p>;
  if (environmentsError) return <p>Error loading environments: {environmentsError.message}</p>;
  if (deploymentsError) return <p>Error loading deployments: {deploymentsError.message}</p>;

  return (
    <div>
      <h2>Services by Environment</h2>
      {environmentsData && environmentsData.environments.edges.map(({ node: environment }) => (
        <div key={environment.id}>
          <h3>{environment.name}</h3>
          {services[environment.id] ? (
            services[environment.id].length > 0 ? (
              <ul>
                {services[environment.id].map(service => (
                  <li key={service.id}>{service.name} (ID: {service.id})</li>
                ))}
              </ul>
            ) : (
              <p>No services in this environment.</p>
            )
          ) : (
            <p>Loading services...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServicesList;