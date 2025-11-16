import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import { setCredentials } from "../authSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        referral_code: "", // Initialized here
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Handlers & Effects ---

    // 1. Effect to capture the referral code from the URL
    useEffect(() => {
        // Reads from URL: /register?ref=CODE
        const refCode = searchParams.get("ref");
        if (refCode) {
            setFormData((prev) => ({ ...prev, referral_code: refCode }));
        }
    }, [searchParams]);

    // 2. Generic input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 3. Form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/register", formData);

            // Success: Save token and user data to Redux and local storage
            dispatch(
                setCredentials({
                    user: response.data.user,
                    token: response.data.access_token,
                })
            );

            navigate("/dashboard"); // Redirect to dashboard
        } catch (err) {
            // Error handling: Extract message from Laravel validation/response
            const serverMessage =
                err.response?.data?.message || err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join("; ")
                    : "Registration failed. Please check your details and try again.";
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
    const AlertInfoStyle =
        "p-4 mb-4 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Create Account
                </h1>

                {formData.referral_code && (
                    <div className={AlertInfoStyle}>
                        You are signing up with a referral code:
                        <span className="font-bold ml-1">
                            {formData.referral_code}
                        </span>
                    </div>
                )}

                {error && <div className={AlertErrorStyle}>{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="name"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className={InputStyle}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>

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
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="password_confirmation"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                            className={InputStyle}
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={ButtonPrimaryStyle}
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner /> : "Register"}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
