// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('accessToken');

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

  return children;
};

export default ProtectedRoute;
