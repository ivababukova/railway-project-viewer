import React, {useEffect, useState} from 'react';
import { Card, Col, Tooltip, Modal, message, Button, Space, Popconfirm } from 'antd';
import styled from 'styled-components';
import { SERVICE_DELETE_MUTATION } from '../graphql/queries';
import { useMutation } from '@apollo/client';
import { DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons';

const StyledCard = styled(Card)`
  background-color: ${(props) => props.color};
`;


const getActionType = (status) => {
  switch (status) {
    case 'SUCCESS':
      return; // blue

    case 'FAILED':
    case 'CRASHED':
      return '#fa8c16'; // orange

    case 'BUILDING':
    case 'INITIALIZING':
    case 'DEPLOYING':
    case 'REMOVING':
    case 'WAITING':
      return '#fadb14'; // light yellow

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


const actionTypes = {
  "DEPLOY": "deploy",
  "DELETE": "delete"
}


const ServiceCard = ({ service, color, refetchFunc }) => {

  const [checked, setChecked] = useState(true);
  const [actionType, setActionType] = useState(null);
  const [serviceDelete] = useMutation(SERVICE_DELETE_MUTATION);
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
    
  },[service.status]) 

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
      console.error('Error creating service:', error);
    }
  }

  const deployService = async () => {
    console.log("DEPLOYING ....")
  }

  const handleCancel = () => {
    setChecked(!checked);
    setIsModalVisible(false);
  }

  const handleSwitchChange = () => {
    setChecked(!checked);
    setIsModalVisible(true);
  }

  const onModalOk = () => {
    setIsModalVisible(false);
    if (actionType === actionTypes["DEPLOY"]) {
      deployService();
    } else if (actionType === actionTypes["DELETE"]) {
      deleteService()
    }
  }

  const renderActionButton = (actionType) => {
    return (
      <Tooltip title="Deploy Service">
        <Popconfirm
          title="Deploy Service"
          description="Are you sure to deploy this service?"
          onConfirm={deployService}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" icon={<ArrowRightOutlined />} />
        </Popconfirm>
      </Tooltip>
    )
  }


  return (
    <Col span={8}>
      <StyledCard 
        hoverable 
        color={color} 
        title={service.name} 
        extra={
          <Space.Compact block>
          <Tooltip title="deploy service">
            <Popconfirm
              title="Deploy Service"
              description="Are you sure to deploy this service?"
              onConfirm={deployService}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<ArrowRightOutlined />} />
            </Popconfirm>
          </Tooltip>
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
          </Space.Compact >
        }
      >
        <p style={{ margin: 0 }}>ID: {service.id}</p>
        <p style={{ margin: 0 }}>Status: {service.status}</p>
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
