import React, {useState, useHook, useEffect} from 'react';
import axios from 'axios';

function LoginButton() {
  const [userData, setUserData] = useState(null);
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/api/user')
        .then((res) => {
            setUserData(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
  })

  return (
    <>
      <div className='LoginButton'>
        <a href="/auth/google">Login via Google</a>
      </div>

      <div className=''>
        {userData ? (
          <>
              <img src={userData.imageUrl} />
              <h1>{userData.displayName}</h1>
              <h1>Logged In</h1>
          </>
        ) : (
            <h1>Logged Out</h1>
        )}
      </div>
    </>
  );
}

export default LoginButton;