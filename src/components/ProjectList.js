import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { List, Card, Button, Spin, Typography } from 'antd';
import { PROJECTS_QUERY } from '../graphql/queries';
import ServicesList from './ServicesList';

const { Title, Paragraph, Text } = Typography;

const ProjectList = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  if (loading) return <Spin />;
  if (error) return <p>Error loading projects: {error.message}</p>;

  const handleOnClick = (id, name) => {
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
      setSelectedProjectName(null);
    } else {
      setSelectedProjectId(id);
      setSelectedProjectName(name);
    }
  };

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

  return (
    <div>
      <Title level={2}>Projects</Title>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data.projects.edges}
        renderItem={({ node }) => {
          const isSelected = selectedProjectId === node.id;
          return (
            <List.Item>
              <Card
                title={node.name}
                extra={
                  <Button onClick={() => handleOnClick(node.id, node.name)}>
                    {isSelected ? 'Hide Services' : 'View Services'}
                  </Button>
                }
              >
                <Paragraph>Project ID: <Text copyable>{node.id}</Text> </Paragraph>
                <Paragraph>Created: {formatDate(node.createdAt)}</Paragraph>
                <Paragraph>Updated: {formatDate(node.updatedAt)}</Paragraph>
              </Card>
            </List.Item>
          );
        }}
      />
      {selectedProjectId && (
        <div style={{ marginTop: 24 }}>
          <Title level={2}>Services in project {selectedProjectName}</Title>
          <ServicesList projectId={selectedProjectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectList;
