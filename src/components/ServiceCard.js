import React, {useEffect, useState} from 'react';
import { Card, Col, Tooltip, Modal, message, Button, Popconfirm, Typography, Space, Select } from 'antd';
import styled from 'styled-components';
import { SERVICE_DELETE_MUTATION, SERVICE_DEPLOY_MUTATION } from '../graphql/queries';
import { useMutation } from '@apollo/client';
import { DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';
const { Text } = Typography;
const { Option } = Select;


const StyledCard = styled(Card)`
  background-color: ${(props) => props.color};
`;


const actionTypes = {
  "DEPLOY": "deploy",
  "DELETE": "delete"
}


const ServiceCard = ({ service, environments, color, refetchFunc }) => {

  const [checked, setChecked] = useState(true);
  const [actionType, setActionType] = useState(null);
  const [serviceDelete] = useMutation(SERVICE_DELETE_MUTATION);
  const [serviceDeploy] = useMutation(SERVICE_DEPLOY_MUTATION);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [environmentId, setEnvironmentId] = useState(null);

  const setActionTypeAndChecked = () => {
    if (['BUILDING', 'INITIALIZING', 'DEPLOYING', 'REMOVING', 'WAITING'].includes(service.status)) {
      return;
    }
    else if (['FAILED', 'CRASHED', 'NOT_DEPLOYED'].includes(service.status)) {
      setChecked(false);
      setActionType(actionTypes["DEPLOY"])
    }
    else {
      setChecked(true);
      setActionType(actionTypes["DEPLOY"]);
    }
  };

  useEffect(() => {
    setActionTypeAndChecked();
    
  },[service.status]) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteService = async () => {
    try {
      await serviceDelete({
        variables: {
          id: service.id
        },
      });

      message.success(`Service ${service.name} deleted successfully!`);
      refetchFunc();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  }

  const deployService = async () => {
    try {
      await serviceDeploy({
        variables: {
          serviceId: service.id,
          environmentId: environmentId
        },
      });

      message.success(`Deployment for service ${service.name} triggered successfully!`);
      refetchFunc();
    } catch (error) {
      console.error('Error triggering deployment for service:', error);
      message.error(`Deployment for service ${service.name} could not be triggered: ${error}.`)
    }
  }

  const content = (
    <Space direction="vertical">
      <div>Select deployment environment:</div>
      <Select
        style={{ width: 200 }}
        placeholder="Select an environment"
        onChange={(value) => setEnvironmentId(value)}
      >
        {environments.map((env) => (
          <Option key={env.envId} value={env.envId}>
            {env.name}
          </Option>
        ))}
      </Select>
      <div>Are you sure you want to deploy this service?</div>
    </Space>
  );

  const handleCancel = () => {
    setChecked(!checked);
    setIsModalVisible(false);
  }

  const onModalOk = () => {
    setIsModalVisible(false);
    if (actionType === actionTypes["DEPLOY"]) {
      deployService();
    } else if (actionType === actionTypes["DELETE"]) {
      deleteService()
    }
  }

  const formatDate = (date) => {
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleString(undefined, dateOptions);
  }

  const renderExtra = () => {
    return (
      <Space.Compact>
        <Tooltip title="deploy service">
          <Popconfirm
            title="Deploy Service"
            description={content}
            onConfirm={deployService}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ disabled: !environmentId }}
          >
            <Button type="text" icon={<CaretRightOutlined />} />
          </Popconfirm>
        </Tooltip>
        <Tooltip title={"delete service"}>
          <Popconfirm
            title="Delete Service"
            description="Are you sure you want to delete this service?"
            onConfirm={deleteService}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Tooltip>
      </Space.Compact>
    )
  }

  return (
    <Col span={8}>
      <StyledCard 
        hoverable 
        color={color} 
        title={service.name} 
        extra={renderExtra()}
      >
        <div style={{ margin: 0 }}>
          ID: <Text copyable>{service.id}</Text>
        </div>
        <p style={{ margin: 0 }}>Last Deployment Status: {service.status}</p>
        {service.updatedAt && <p style={{ margin: 0 }}>Last Deployment: {formatDate(service.updatedAt)}</p>}
      </StyledCard>
      <Modal
        title={["Are you sure you want to ", actionType, " this service?"].join("")}
        open={isModalVisible}
        onOk={onModalOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      ></Modal>
    </Col>
  )
};

export default ServiceCard;
