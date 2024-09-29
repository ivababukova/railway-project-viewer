import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import axios from 'axios';


const { Title, Paragraph, Link } = Typography;


const getUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000/api/set-token';
  }
  return "https://project-viewer-server-production.up.railway.app/api/set-token";
}


function UserTokenInput({ onTokenSet }) {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState(null);


  const handleSubmit = async (values) => {
    const { token } = values;
    const url = getUrl();
    try {
      await axios.post(url, { token }, { withCredentials: true });
      setErrorMessage(null);
      onTokenSet();
    } catch (error) {
      setErrorMessage('Invalid token or server error. Please try again.');
      form.resetFields(['token']);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' }}>
      <Title level={4} style={{ textAlign: 'center' }}>
        Welcome to Railway Project Viewer!
      </Title>
      <Paragraph style={{ marginTop: 20, fontSize: 16, lineHeight: 1.5 }}>
        Log in using a
        <Link
          href="https://docs.railway.app/guides/public-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}Railway public API token
        </Link>. <br /> 
        Create one by visiting the{' '}
        <Link
          href="https://railway.app/account/tokens"
          target="_blank"
          rel="noopener noreferrer"
        >
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
