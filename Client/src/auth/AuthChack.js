import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/authentication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        //

        const data = await response.json();
        setIsAuthenticated(data.status === "ok");
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (isAuthenticated) {
    return <>{children}</>;
  } else {
    alert('Authentication failed');
    navigate("/");
    return (
      <div>
        <p>Authentication failed. Please log in.</p>
      </div>
    );
  }
};

export default AuthCheck;
