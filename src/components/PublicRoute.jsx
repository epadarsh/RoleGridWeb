import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    // We use the isAuthenticated flag from Redux state
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If the user is authenticated (logged in), redirect them to the home page or dashboard.
    if (isAuthenticated) {
        // You can customize the redirect path here (e.g., to '/dashboard')
        return <Navigate to="/" replace />;
    }

    // If the user is NOT authenticated, allow them to view the Login/Register page.
    return <Outlet />;
};

export default PublicRoute;
