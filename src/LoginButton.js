import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

function LoginButton() {
  return (
    <BrowserRouter>
      <div>
        <Link to='/login'>
          <button>Login</button>
        </Link>
      </div>
    </BrowserRouter>
  );
}

export default LoginButton;