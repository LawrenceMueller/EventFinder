import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Register user
  const register = async (user) => {
    console.log(user);
  };

  // Login user
  /*the syntax email:identifier means that we are using
    email as "identifier". Strapi expects identifier 
    because it supports multiple ways to log in
    */
  const login = async ({ email: identifier, password }) => {
    console.log({ identifier, password });
  };

  // Check if useris logged in
  const logout = async () => {
    console.log('Logout');
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    console.log('Check');
  };

  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
