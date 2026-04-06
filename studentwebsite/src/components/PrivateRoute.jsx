import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute — accessible only when logged in.
 * If no token in localStorage, redirect to /login.
 */
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
