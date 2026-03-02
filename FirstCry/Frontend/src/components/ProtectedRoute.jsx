import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    console.log("ProtectedRoute check for role:", allowedRole);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/home" replace />;
    }

   
    return children;
};

export default ProtectedRoute;