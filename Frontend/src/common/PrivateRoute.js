import React from 'react';
import { Navigate } from 'react-router-dom';

function useAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token;
}
export default function PrivateRoute({ children }) {

    const isAuthenticated = useAuth();

    return isAuthenticated ? children : <Navigate to="/login" />;

}
