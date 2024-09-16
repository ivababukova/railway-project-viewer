import { useMemo } from 'react';

export const useServicesData = (data) => {
  return useMemo(() => {
    if (!data) {
      return { servicesByType: {} };
    }

    const services = getServiceMap(data);
    const servicesByType = categorizeServices(services, data.environments.edges);

    return { servicesByType };
  }, [data]);
};

const getServiceMap = (data) => {
  const serviceMap = {};

  const projectServices = data.project?.services?.edges || [];
  projectServices.forEach(({ node: service }) => {
    serviceMap[service.id] = {
      ...service,
      status: 'NOT_DEPLOYED',
      environments: new Set(),
    };
  });

  const deployments = data.deployments?.edges || [];
  deployments.forEach(({ node: deployment }) => {
    const serviceId = deployment.service.id;
    const environmentId = deployment.environment.id;

    if (serviceMap[serviceId]) {
      const service = serviceMap[serviceId];
      service.status = deployment.status;
      service.environments.add(environmentId);

      if (!service.name) {
        service.name = deployment.service.name;
      }
    } else {
      serviceMap[serviceId] = {
        ...deployment.service,
        status: deployment.status,
        environments: new Set([environmentId]),
      };
    }
  });

  return Object.values(serviceMap);
};

const categorizeServices = (services, environmentEdges) => {
  const servicesByType = {};

  environmentEdges.forEach(({ node: environment }) => {
    servicesByType[environment.id] = {
      name: environment.name,
      services: [],
    };
  });

  servicesByType['not-deployed'] = {
    name: 'Not Deployed',
    services: [],
  };

  services.forEach((service) => {
    if (service.status !== 'NOT_DEPLOYED' && service.environments.size > 0) {
      service.environments.forEach((envId) => {
        if (servicesByType[envId]) {
          servicesByType[envId].services.push(service);
        }
      });
    } else {
      servicesByType['not-deployed'].services.push(service);
    }
  });

  return servicesByType;
};