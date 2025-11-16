import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
// IMPORTANT: Ensure AuthInitializer.jsx is in src/components/
import AuthInitializer from "./components/AuthInitializer.jsx";

// Auth Pages
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";

// User Pages
import UserDashboard from "./features/user/pages/UserDashboard.jsx";

// Admin Pages
import AdminDashboard from "./features/admin/pages/AdminDashboard.jsx";
import UserManagementPage from "./features/admin/pages/UserManagementPage.jsx";
import ProductManagementPage from "./features/admin/pages/ProductManagementPage.jsx";

// Public Pages
import PublicProductsPage from "./features/public/pages/PublicProductsPage.jsx";

function App() {
    return (
        <BrowserRouter>
            {/* CRITICAL FIX: AuthInitializer wraps the entire application.
        It checks the token on every load and restores the user session
        into Redux, fixing the "logged out on refresh" problem.
      */}
            <AuthInitializer>
                <Navbar />
                <main className="p-4 bg-gray-50 min-h-screen">
                    <Routes>
                        {/* Public Routes (Accessible without login) */}
                        <Route path="/" element={<PublicProductsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

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
