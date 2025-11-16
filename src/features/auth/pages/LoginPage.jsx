import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import { setCredentials } from "../authSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/login", formData);

            // Success: Save token and user data to Redux and local storage
            dispatch(
                setCredentials({
                    user: response.data.user,
                    token: response.data.access_token,
                })
            );

            // Redirect based on role (though ProtectedRoute will handle role check)
            if (response.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            const serverMessage =
                err.response?.data?.message ||
                "Login failed. Invalid credentials or server error.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- Tailwind Utility Styles ---
    const InputStyle =
        "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md disabled:opacity-50";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";
    const LoadingSpinner = () => (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white inline-block mr-2"></div>
    );

    // Placeholder image URL - replaced with a relevant placeholder
    const imageUrl =
        "https://placehold.co/800x600/6366F1/FFFFFF?text=Referral+System+Dashboard";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Left Side: Image / Visual (Hidden on small screens) */}
                <div className="hidden lg:block lg:w-1/2 p-6">
                    <div className="h-full bg-indigo-500 rounded-lg flex items-center justify-center">
                        <img
                            src={imageUrl}
                            alt="Referral System Dashboard"
                            className="w-full h-full object-cover rounded-lg transform transition duration-500 hover:scale-[1.02]"
                            onError={(e) => {
                                // Fallback if placeholder URL fails
                                e.target.onerror = null;
                                e.target.src =
                                    "https://placehold.co/800x600/4F46E5/FFFFFF?text=Referral+App+Visual";
                            }}
                        />
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 p-12 flex items-center justify-start lg:justify-end">
                    <div className="w-full max-w-sm space-y-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to access your dashboard and referrals.
                        </p>

                        {error && (
                            <div className={AlertErrorStyle}>{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="email"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className={InputStyle}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className={InputStyle}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                />
                            </div>

                            <button
                                type="submit"
                                className={ButtonPrimaryStyle}
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner /> : "Sign In"}
                            </button>
                        </form>

                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?
                            <Link
                                to="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                            >
                                Register now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
