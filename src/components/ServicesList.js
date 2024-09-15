import React from 'react';
import { useQuery } from '@apollo/client';
import { Col, Row, Spin, Typography } from 'antd';
import { ENVIRONMENTS_WITH_SERVICES_QUERY } from '../graphql/queries';
import ServiceCard from './ServiceCard';
import { useServicesData } from '../hooks/useServicesData';

const { Title } = Typography;

const ServicesList = ({ projectId }) => {
  const { data, loading, error } = useQuery(ENVIRONMENTS_WITH_SERVICES_QUERY, {
    variables: { projectId },
  });

  const { servicesByType } = useServicesData(data);

  if (loading) return <Spin />;
  if (error) return <p>Error loading data: {error.message}</p>;

  const renderServices = (servicesList, color) => {
    if (!servicesList || servicesList.length === 0) {
      return (
        <Col span={24}>
          <p>No services found.</p>
        </Col>
      );
    }

    return servicesList.map((service) => (
      <ServiceCard key={service.id} service={service} color={color} />
    ));
  };

  return (
    <div>
      <Title level={2}>Services by Environment</Title>
      {Object.entries(servicesByType).map(([envId, { name, color, services }]) => (
        <div key={envId} style={{ marginBottom: 24 }}>
          <Title level={3}>{name}</Title>
          <Row gutter={[16, 16]}>
            {renderServices(services, color)}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ServicesList;
