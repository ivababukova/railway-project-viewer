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
      return '#4EA6F9'; // blue

    case 'FAILED':
    case 'CRASHED':
      return '#F98203'; // orange

    case 'BUILDING':
    case 'INITIALIZING':
      return '#FDEB71'; // light yellow
    case 'DEPLOYING':
    case 'REMOVING':
    case 'WAITING':
      return '#fadb14'; // yellow

    case 'SKIPPED':
    case 'SLEEPING':
    case 'REMOVED':
    case 'NEEDS_APPROVAL':
    case 'QUEUED':
    case 'NOT_DEPLOYED':
    default:
      return '#808080'; // gray
  }
};

const getStatusType = (status) => {
  const statusTypes = {
    "SUCCESS": ['SUCCESS'],
    "FAIL": ['FAILED', 'CRASHED'],
    "IN_PROGRESS": ['BUILDING', 'INITIALIZING', 'DEPLOYING', 'REMOVING', 'WAITING'],
    "BLOCKED": ['NEEDS_APPROVAL'],
    "INACTIVE": ['SKIPPED', 'SLEEPING', 'REMOVED', 'QUEUED', 'NOT_DEPLOYED']
  }

  const statusProps = {
    "SUCCESS": {
      color: '#1890ff',
      actions: 'delete'
    },

  }
}


const ServicesList = ({ projectId }) => {
  const { data, loading, error, refetch } = useQuery(ENVIRONMENTS_WITH_SERVICES_QUERY, {
    variables: { projectId },
    pollInterval: 3000 // poll every 3 seconds to see if data is updated
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

  const renderServices = (servicesList) => {
    if (!servicesList || servicesList.length === 0) {
      return (
        <Col span={24}>
          <p>No services found.</p>
        </Col>
      );
    }

    console.log("*** SERVICES: ", servicesList);

    return servicesList.map((service) => (
      <ServiceCard key={service.id} service={service} color={getStatusColor(service.status)} refetchFunc={refetch} />
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

        message.success(`Service ${newServiceName} created successfully!`);
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