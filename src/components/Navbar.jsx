import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import api from "../services/api";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Tailwind Style Definitions
    const NavLinkStyle =
        "px-4 py-2 rounded-lg text-white font-medium hover:bg-indigo-700 transition duration-150";
    const NavButtonStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md";
    const LogoutButtonStyle =
        "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md";

    const handleLogout = async () => {
        try {
            // API call to revoke Sanctum token
            await api.post("/logout");
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            // In case API fails, we still clear local state for user experience
            console.error("Logout API failed, clearing local session.", error);
            dispatch(logout());
            navigate("/login");
        }
    };

    return (
        <nav className="bg-gray-800 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-extrabold text-white tracking-wider"
                        >
                            RoleGrid
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className={NavLinkStyle}>
                            Public Products
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/products/internal"
                                    className={NavLinkStyle}
                                >
                                    Internal Store
                                </Link>

                                {user?.role === "admin" && (
                                    <Link to="/admin" className={NavLinkStyle}>
                                        Admin Panel
                                    </Link>
                                )}

                                {/* Dashboard Link (for both User and Admin) */}
                                <Link to="/dashboard" className={NavLinkStyle}>
                                    Dashboard
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className={LogoutButtonStyle}
                                >
                                    Logout ({user?.name.split(" ")[0]})
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Public Auth Links */}
                                <Link to="/login" className={NavLinkStyle}>
                                    Login
                                </Link>
                                <Link to="/register" className={NavButtonStyle}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
