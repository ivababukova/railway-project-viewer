// UserTokenInput.js
import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { setToken } from '../token.js';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../graphql/queries';

const { Title, Paragraph, Link } = Typography;

function UserTokenInput({ onTokenSet }) {
  const [form] = Form.useForm();
  const [submittedToken, setSubmittedToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useQuery(ME_QUERY, {
    skip: !submittedToken,
    onCompleted: () => {
      onTokenSet();
    },
    onError: () => {
      setErrorMessage('Invalid token. Please try again.');
      setToken('');
      form.resetFields(['token']);
      setSubmittedToken(null);
    },
  });

  const handleSubmit = (values) => {
    const { token } = values;
    setToken(token);
    setSubmittedToken(token);
    setErrorMessage(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' }}>
      <Title level={4} style={{ textAlign: 'center' }}>
        Welcome to Railway Project Viewer!
      </Title>
      <Paragraph style={{ marginTop: 20, fontSize: 16, lineHeight: 1.5 }}>
        Log in using a
        <Link href="https://docs.railway.app/guides/public-api" target="_blank" rel="noopener noreferrer">
        {' '}Railway public API token
        </Link>. <br /> Create one by visiting the{' '}
        <Link href="https://railway.app/account/tokens" target="_blank" rel="noopener noreferrer">
          tokens
        </Link>{' '}
        page in your Railway account settings.
      </Paragraph>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginTop: 20 }}
        />
      )}
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="token"
          rules={[
            {
              required: true,
              message: 'Please input your authentication token!',
            },
          ]}
        >
          <Input.Password placeholder="Enter your auth token" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Token
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserTokenInput;
