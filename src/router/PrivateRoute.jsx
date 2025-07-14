

import { Navigate, useLocation } from 'react-router';

import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    
    const location = useLocation();
    const { user, loading } = useAuth();
    if(loading){
        return <span className="loading loading-ring loading-xl"></span>
    }

    if(!user){
       return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;

