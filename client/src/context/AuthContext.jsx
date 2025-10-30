import React, { createContext, useContext, useEffect, useState } from 'react';
import { me } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (token) {
          const { data } = await me(token);
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const loginCtx = (t, u, remember) => {
    if (remember) localStorage.setItem('token', t);
    else sessionStorage.setItem('token', t); // session-only fallback
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Restore from sessionStorage if needed
  useEffect(() => {
    if (!token) {
      const t = sessionStorage.getItem('token');
      if (t) setToken(t);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loginCtx, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Allow exporting this hook alongside the Provider. The react-refresh rule
// "only-export-components" is noisy for files that intentionally export
// hooks + provider together. Disable the rule for this export line.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
