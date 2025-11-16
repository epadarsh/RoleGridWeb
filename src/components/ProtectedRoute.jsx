// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles }) => {
//     const { isAuthenticated, user } = useSelector((state) => state.auth);

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     // Check role authorization
//     if (allowedRoles && user && !allowedRoles.includes(user.role)) {
//         return <Navigate to="/" replace />; // Redirect unauthorized users
//     }

//     return <Outlet />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role authorization
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect standard users from Admin routes to their dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
