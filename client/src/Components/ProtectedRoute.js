import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const ProtectedRoute = ({ allowedRole }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.role === allowedRole
            ? <Outlet />
            : auth?.accessToken
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;