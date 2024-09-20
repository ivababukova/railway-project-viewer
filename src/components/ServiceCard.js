import React, {useEffect, useState} from 'react';
import { Card, Col, Tooltip, Modal, message, Button, Space, Popconfirm, Typography } from 'antd';
import styled from 'styled-components';
import { SERVICE_DELETE_MUTATION } from '../graphql/queries';
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

  const onModalOk = () => {
    setIsModalVisible(false);
    if (actionType === actionTypes["DEPLOY"]) {
      deployService();
    } else if (actionType === actionTypes["DELETE"]) {
      deleteService()
    }
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
              <Button type="text" icon={<CaretRightOutlined />} />
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
        <p style={{ margin: 0 }}>ID: <Text copyable>{service.id}</Text></p>
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
