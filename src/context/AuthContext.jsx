import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null); 
  const [appLoad, setAppLoad] = useState(true)
  const [statsData, setStatsData] = useState({})


  const fetchAdminData = async () => {
    try {
      const token = Cookies.get('token'); 
      if (!token) {
        setAdminData(null);
        setAppLoad(false);
        return;
      }
      const response = await api.get('/admin/profile')
      if (response.success) {
        setAdminData(response.data);
      } else {
          setAdminData(null);
      }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setAdminData(null);
      } finally {
        setAppLoad(false);
      }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);




  return (
    <AuthContext.Provider value={{adminData, setAdminData, appLoad, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);