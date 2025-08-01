import React, { createContext, useState, useEffect, useContext } from 'react';

import Cookies from 'js-cookie';
import axios from 'axios';
import api from '../api/axios';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null); // User state


  const fetchAdminData = async () => {
    try {
      const token = Cookies.get('token');   
      console.log('Token:', token); // Debugging line
        if (!token) {
            setAdminData(null);
            return;
        }
      const response = await api.get('/admin/profile')
        if (response.status === 200) {
            setAdminData(response.data);
        } else {
            setAdminData(null);
        }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setAdminData(null);
    }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);


  return (
    <AuthContext.Provider value={{adminData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);