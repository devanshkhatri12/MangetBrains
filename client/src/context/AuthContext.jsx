import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const setToken = (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ user, setUser, setToken }}>{children}</AuthContext.Provider>;
};
