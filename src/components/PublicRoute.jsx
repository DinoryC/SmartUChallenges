import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ isAuthenticated, children }) => {
    if (isAuthenticated) {
        return <Navigate to="/literacyHome/vocabGardenApp/user" replace />;
    }
    
    return children;
};

export default PublicRoute;
