import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();


  useEffect(() => {
    // Extract the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    if (token && userStr) {
      // Save the token in localStorage or in a global state
      const user = JSON.parse(decodeURIComponent(userStr));
      localStorage.setItem('token',JSON.stringify(token));
      localStorage.setItem('user',JSON.stringify(user));
      navigate('/');
    } else {
      // Handle the error or redirect to the login page
      navigate('/login');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
