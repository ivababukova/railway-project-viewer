import React from 'react';
import { Popover, Button, List, Typography, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeploymentLogs = (logs, visible, onClose) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'red';
      case 'warn':
        return 'orange';
      case 'info':
        return 'blue';
      default:
        return 'default';
    }
  };

  console.log("++++ in component!!!!!", logs);

  const content = (
    <div style={{ maxWidth: 600, maxHeight: 400, overflow: 'auto' }}>
      <Button
        icon={<CloseOutlined />}
        style={{ float: 'right' }}
        type="text"
        onClick={onClose}
      />
      <List
        dataSource={logs}
        renderItem={(log) => (
          <List.Item>
            <List.Item.Meta
              title={
                <span>
                  <Tag color={getSeverityColor(log.severity)}>{log.severity}</Tag>
                  <Text type="secondary" style={{ fontSize: '0.8em' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </Text>
                </span>
              }
              description={<Text>{log.message}</Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      title="Deployment Logs"
      visible={visible}
      onVisibleChange={onClose}
      placement="topRight"
      trigger="click"
    >
      <div /> {/* This empty div is necessary for the popover to work without a visible trigger */}
    </Popover>
  );
};

export default DeploymentLogs;