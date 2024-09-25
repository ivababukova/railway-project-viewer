import React, {useEffect, useState} from 'react';
import { Card, Col, Tooltip, Modal, message, Button, Popconfirm, Typography, Space } from 'antd';
import styled from 'styled-components';
import { SERVICE_DELETE_MUTATION, SERVICE_DEPLOY_MUTATION } from '../graphql/queries';
import { useMutation } from '@apollo/client';
import { DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';
const { Text } = Typography;

const StyledCard = styled(Card)`
  background-color: ${(props) => props.color};
`;


const actionTypes = {
  "DEPLOY": "deploy",
  "DELETE": "delete"
}


const ServiceCard = ({ service, color, refetchFunc, onCardClick }) => {

  const [checked, setChecked] = useState(true);
  const [actionType, setActionType] = useState(null);
  const [serviceDelete] = useMutation(SERVICE_DELETE_MUTATION);
  const [serviceDeploy] = useMutation(SERVICE_DEPLOY_MUTATION);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          environmentId: "1d4528f8-8a45-49a7-a4d9-841d8352c0dc" // TODO: parametrize this
        },
      });

      message.success(`Deployment for service ${service.name} triggered successfully!`);
      refetchFunc();
    } catch (error) {
      console.error('Error triggering deployment for service:', error);
    }
  }

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
        {(service.status === 'FAILED' || service.status === 'CRASHED' || service.status === 'NOT_DEPLOYED') && (
          <Tooltip title="deploy service">
            <Popconfirm
              title="Deploy Service"
              description="Are you sure to deploy this service?"
              onConfirm={deployService}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<CaretRightOutlined />} />
            </Popconfirm>
          </Tooltip>
        )}
        <Tooltip title={"delete service"}>
          <Popconfirm
            title="Delete Service"
            description="Are you sure to delete this service?"
            onConfirm={deleteService}
            onCancel={() => {}}
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
        onClick={() => {onCardClick(service.id)}}
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
