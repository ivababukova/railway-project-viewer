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
      deployed: false,
      environments: new Set(),
    };
  });

  const deployments = data.deployments?.edges || [];
  deployments.forEach(({ node: deployment }) => {
    const serviceId = deployment.service.id;
    const environmentId = deployment.environment.id;

    if (serviceMap[serviceId]) {
      const service = serviceMap[serviceId];
      service.deployed = true;
      service.environments.add(environmentId);

      if (!service.name) {
        service.name = deployment.service.name;
      }
    } else {
      serviceMap[serviceId] = {
        ...deployment.service,
        deployed: true,
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
      color: '#52c41a',
      services: [],
    };
  });

  servicesByType['not-deployed'] = {
    name: 'Not Deployed',
    color: '#808080',
    services: [],
  };

  services.forEach((service) => {
    if (service.deployed && service.environments.size > 0) {
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
