import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Col, Row, Spin, Typography, Button, Modal, Input, Radio, message } from 'antd';
import { ENVIRONMENTS_WITH_SERVICES_QUERY, SERVICE_CREATE_MUTATION } from '../graphql/queries';
import ServiceCard from './ServiceCard';
import { useServicesData } from '../hooks/useServicesData';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const getStatusColor = (status) => {
  switch (status) {
    case 'SUCCESS':
      return '#52c41a'; // green
    case 'FAILED':
      return '#f5222d'; // red
    case 'NOT_DEPLOYED':
    default:
      return '#808080'; // gray
  }
};

const ServicesList = ({ projectId }) => {
  const { data, loading, error, refetch } = useQuery(ENVIRONMENTS_WITH_SERVICES_QUERY, {
    variables: { projectId },
    pollInterval: 5000 // poll every 5 seconds to see if data is updated
  });
  const [serviceCreate, { loading: serviceCreateLoading }] = useMutation(SERVICE_CREATE_MUTATION);

  console.log("DATA: ", data);
  const { servicesByType } = useServicesData(data);
  console.log("servicesByType: ", servicesByType);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [sourceType, setSourceType] = useState('repo');
  const [sourceValue, setSourceValue] = useState('');


  if (loading) return <Spin size="large" />;
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
      <ServiceCard key={service.id} service={service} color={getStatusColor(service.status)} />
    ));
  };


  const handleOk = async () => {
    if (newServiceName && sourceValue) {
      try {
        const sourceInput = sourceType === 'repo' 
          ? { repo: sourceValue }
          : { image: sourceValue };

        await serviceCreate({
          variables: {
            input: {
              name: newServiceName,
              projectId,
              source: sourceInput,
            },
          },
        });

        message.success('Service created successfully!');
        setIsModalVisible(false);
        resetForm();
        refetch();
      } catch (error) {
        console.error('Error creating service:', error);
        message.error(`Error creating service: ${error.message || 'Unknown error occurred'}`);
      }
    } else {
      message.warning('Please fill in both service name and source value.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setNewServiceName('');
    setSourceType('repo');
    setSourceValue('');
  };

  return (
    <div>
      <Title level={2}>Services by Environment</Title>
      <Button onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
        Create New Service
      </Button>
      <Modal
        title="Create New Service"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
        confirmLoading={serviceCreateLoading}
      >
        <Input
          placeholder="Service Name"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Radio.Group 
          onChange={(e) => setSourceType(e.target.value)} 
          value={sourceType}
          style={{ marginBottom: 16 }}
        >
          <Radio value="repo">Repository</Radio>
          <Radio value="image">Image</Radio>
        </Radio.Group>
        <Input
          placeholder={sourceType === 'repo' ? "GitHub Repo URL" : "Docker Image Name"}
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
        />
      </Modal>
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