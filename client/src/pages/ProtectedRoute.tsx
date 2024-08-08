import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

interface ProtectedRouteProps {
    element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { authState } = useContext(AuthContext);

    return authState.status ? <>{element}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;