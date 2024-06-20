// components/GuestRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ element }) => {
    const { currentUser } = useSelector((state) => state.user);

  return !currentUser ? element : <Navigate to="/" />;
};

export default GuestRoute;
