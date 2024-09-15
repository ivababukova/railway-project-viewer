import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { List, Card, Button, Spin, Typography } from 'antd';
import { PROJECTS_QUERY } from '../graphql/queries';
import ServicesList from './ServicesList';

const { Title } = Typography;

const ProjectList = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  if (loading) return <Spin />;
  if (error) return <p>Error loading projects: {error.message}</p>;

  const handleOnClick = (id) => {
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(id);
    }
  };

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
                  <Button onClick={() => handleOnClick(node.id)}>
                    {isSelected ? 'Hide Services' : 'View Services'}
                  </Button>
                }
              >
                Project ID: {node.id}
              </Card>
            </List.Item>
          );
        }}
      />
      {selectedProjectId && (
        <div style={{ marginTop: 24 }}>
          <ServicesList projectId={selectedProjectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectList;
