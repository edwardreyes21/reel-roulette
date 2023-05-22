import React, {useState, useHook, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LoginButton.css'

function LoginButton() {
  const [userData, setUserData] = useState(null);
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log(userData);
  }, [userData])

  useEffect(() => {
    axios.get('/api/user')
      .then((res) => {
          setUserData(res.data);
      })
      .catch((err) => {
          console.error(err);
      })
  }, [])

  return (
    <>
      {userData ? (
        <div className='logout-button'>
          <a href="/auth/logout">Logout</a>
          <Link to="/watchlist">Go to Watchlist</Link>
        </div>
      ) : (
        <div className='login-button'>
        <a href="/auth/google">Login via Google</a>
        </div>
      )}
      <div className='user-data-box'>
        {userData && (
          <>
              <img src={userData.imageUrl} />
              <h1>{userData.displayName}</h1>
              <h1>Logged In</h1>
          </>
        )}
      </div>
    </>
  );
}

export default LoginButton;