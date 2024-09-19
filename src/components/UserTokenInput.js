import React, { useState } from 'react';
import { setToken } from '../token.js';

function UserTokenInput({ onTokenSet }) {
  const [inputToken, setInputToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setToken(inputToken);
    onTokenSet();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={inputToken}
        onChange={(e) => setInputToken(e.target.value)}
        placeholder="Enter your auth token"
      />
      <button type="submit">Submit Token</button>
    </form>
  );
}

export default UserTokenInput;