import React from 'react';
import { Card, Col, Switch } from 'antd';
import styled from 'styled-components';


const StyledCard = styled(Card)`
  background-color: ${(props) => props.color};
`;

const handleSwitchChange = () => {
  console.log("*** I was switched");
}

const ServiceCard = ({ service, color }) => (
  <Col span={8}>
    <StyledCard 
      hoverable 
      color={color} 
      title={service.name} 
      extra={<Switch onChange={handleSwitchChange}></Switch>}
    >
      <p style={{ margin: 0 }}>ID: {service.id}</p>
      <p style={{ margin: 0 }}>Status: {service.status}</p>
    </StyledCard>
  </Col>
);

export default ServiceCard;
