// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
// import AuthCheck from './AuthCheck';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [IsAuthenticated, setIsAuthenticated] = useState();

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

        const data = await response.json();
        setIsAuthenticated(data.status === "ok");
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ IsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

