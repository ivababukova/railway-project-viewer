import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { List, Card, Button, Spin } from 'antd';
import { PROJECTS_QUERY } from '../graphql/queries';
import ServicesList from './ServicesList';

function ProjectList() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [buttonName, setButtonName] = useState("View Services");
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  if (loading) return <Spin />;
  if (error) return <p>Error :(</p>;

  const handleOnClick = (id) => {
    if(buttonName === "View Services") {
      setSelectedProjectId(id);
      setButtonName("Hide Services");
    }
    else {
      setSelectedProjectId(null);
      setButtonName("View Services");
    }
  }

  return (
    <div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data.projects.edges}
        renderItem={({ node }) => (
          <List.Item>
            <Card
              title={node.name}
              extra={<Button onClick={() => handleOnClick(node.id)
              }>{buttonName}</Button>}
            >
              Project ID: {node.id}
            </Card>
          </List.Item>
        )}
      />
      {selectedProjectId && <ServicesList projectId={selectedProjectId} />}
    </div>
  );
}

export default ProjectList;