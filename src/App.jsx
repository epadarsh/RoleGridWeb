import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PublicRoute from "./components/PublicRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./components/ProductsPage.jsx";
import ToastManager from "./components/ToastManager.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import AuthInitializer from "./components/AuthInitializer.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import UserDashboard from "./features/user/pages/UserDashboard.jsx";
import AdminDashboard from "./features/admin/pages/AdminDashboard.jsx";
import UserManagementPage from "./features/admin/pages/UserManagementPage.jsx";
import ProductManagementPage from "./features/admin/pages/ProductManagementPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <ToastManager />
            <AuthInitializer>
                <Navbar />
                <main className="p-4 bg-gray-50 min-h-screen">
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/"
                            element={<ProductsPage isExternal={true} />}
                        />

                        {/* Restricted Auth Routes: Redirects logged-in users away from /login and /register */}
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/register"
                                element={<RegisterPage />}
                            />
                        </Route>

                        {/* Protected Routes: User and Admin Access */}
                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={["user", "admin"]}
                                />
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={<UserDashboard />}
                            />
                            <Route
                                path="/products/internal"
                                element={<ProductsPage />}
                            />
                        </Route>

                        {/* Protected Routes: Admin Only Access */}
                        <Route
                            element={
                                <ProtectedRoute allowedRoles={["admin"]} />
                            }
                        >
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route
                                path="/admin/users"
                                element={<UserManagementPage />}
                            />
                            <Route
                                path="/admin/products"
                                element={<ProductManagementPage />}
                            />
                        </Route>

                        {/* Fallback */}
                        <Route
                            path="*"
                            element={
                                <div className="text-center text-2xl font-bold mt-10 text-gray-700">
                                    404 Not Found
                                </div>
                            }
                        />
                    </Routes>
                </main>
            </AuthInitializer>
        </BrowserRouter>
    );
}

export default App;
