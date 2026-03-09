import { Navigate } from 'react-router-dom';

/**
 * PublicRoute — accessible only when NOT logged in.
 * If a token already exists in localStorage, redirect to /home.
 */
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
