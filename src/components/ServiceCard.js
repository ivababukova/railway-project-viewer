import React from 'react';
import { Card, Col, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const StyledCard = styled(Card)`
  background-color: ${(props) => props.color};
  color: white;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledTitle = styled(Title)`
  color: white !important;
  margin: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ServiceCard = ({ service, color }) => (
  <Col span={8}>
    <StyledCard hoverable color={color}>
      <StyledTitle level={4}>
        Name: {service.name || 'Unknown Service'}
      </StyledTitle>
      <p style={{ margin: 0 }}>ID: {service.id}</p>
      <p style={{ margin: 0 }}>Status: {service.status}</p>
    </StyledCard>
  </Col>
);

export default ServiceCard;
