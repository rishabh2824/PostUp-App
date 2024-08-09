import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { authState } = useContext(AuthContext);

    if (authState.isLoading) {
        return <div>Loading...</div>; // Show loading state while authentication is being verified
    }

    return authState.status ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;