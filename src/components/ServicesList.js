import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Col, Row, Spin, Typography } from 'antd';
import { ENVIRONMENTS_QUERY, DEPLOYMENTS_QUERY, ENVIRONMENTS_WITH_SERVICES_QUERY} from '../graphql/queries';

const { Title } = Typography;

const ServicesList = ({ projectId }) => {

  const { data, loading, error } = useQuery(ENVIRONMENTS_WITH_SERVICES_QUERY, {
    variables: { projectId },
  });

  const services = useMemo(() => {

    if (!data) return {};
  
    const newServices = {};
    data.environments.edges.forEach(({ node: environment }) => {
      const environmentServices = [];
      const serviceIds = new Set();

      data.deployments.edges.forEach(({ node }) => {
        if (node.environment.id === environment.id && !serviceIds.has(node.service.id)) {
          serviceIds.add(node.service.id);
          environmentServices.push(node.service);
        }
      });
      newServices[environment.id] = environmentServices;
    });

    return newServices;
  }, [data]);

  if (loading) return <Spin />;
  if (error) return <p>Error loading data: {error.message}</p>;


  const renderServices = (environmentId) => {
    const envServices = services[environmentId];
    if (!envServices) return <Col span={24}><Spin /></Col>;
    if (envServices.length === 0) return <Col span={24}><Card>No services in this environment.</Card></Col>;
  
    return envServices.map((service) => (
      <Col span={8} key={service.id}>
        <Card hoverable style={{ backgroundColor: '#52c41a', color: 'white' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>{service.name}</Title>
          <p>ID: {service.id}</p>
        </Card>
      </Col>
    ));
  };

  return (
    <div>
      <Title level={2}>Services by Environment</Title>
      {data && data.environments.edges.map(({ node: environment }) => (
        <div key={environment.id} style={{ marginBottom: 24 }}>
          <Title level={3}>{environment.name}</Title>
          <Row gutter={[16, 16]}>
            {renderServices(environment.id)}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ServicesList;