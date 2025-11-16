import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../services/api";
import { setUser } from "../../auth/authSlice";

// NOTE: Replace this with your actual front-end base URL
const FRONTEND_BASE_URL = "http://localhost:5173";

const UserDashboard = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copyStatus, setCopyStatus] = useState(false);

    // --- Tailwind Utility Components/Styles ---
    const CardStyle =
        "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";
    const ButtonStyle =
        "bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md disabled:opacity-50";
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
    );

    // --- Data Fetching ---

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetches user data, including the latest referral_count
            const response = await api.get("/user");
            console.log("aa_response", response);

            dispatch(setUser(response.data)); // Update global user state
        } catch (err) {
            console.log("User Data Fetch Error:--->>", err);
            setError(
                "Failed to fetch dashboard data. Your session might be expired."
            );
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        // If we have a token but no user object, fetch the details.
        if (!currentUser) {
            fetchUserData();
        } else {
            // If user data is already in Redux, stop loading immediately
            setLoading(false);
        }
    }, [currentUser, fetchUserData]);

    // --- Referral Logic ---

    const referralCode = currentUser?.referral_code;
    const referralLink = referralCode
        ? `${FRONTEND_BASE_URL}/register?ref=${referralCode}`
        : "";

    const handleCopyLink = () => {
        if (referralLink) {
            // Use document.execCommand('copy') for better compatibility in iframe environments
            const el = document.createElement("textarea");
            el.value = referralLink;
            el.setAttribute("readonly", "");
            el.style.position = "absolute";
            el.style.left = "-9999px";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);

            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 2000); // Reset copy status after 2s
        }
    };

    // --- Render Logic ---

    if (loading) return <LoadingSpinner />;
    if (error) return <div className={AlertErrorStyle}>{error}</div>;
    if (!currentUser)
        return (
            <div className={AlertErrorStyle}>
                User data not available. Please log in.
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-2">
                👋 Welcome, {currentUser.name}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className={`${CardStyle} lg:col-span-1`}>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Account Overview
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            <span className="font-medium text-gray-800">
                                Email:
                            </span>{" "}
                            {currentUser.email}
                        </p>
                        <p>
                            <span className="font-medium text-gray-800">
                                Role:
                            </span>
                            <span
                                className={`ml-2 px-3 py-1 text-xs font-bold uppercase rounded-full ${
                                    currentUser.role === "admin"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                            >
                                {currentUser.role}
                            </span>
                        </p>
                        {currentUser.referrer && (
                            <p>
                                <span className="font-medium text-gray-800">
                                    Referred By:
                                </span>{" "}
                                {currentUser.referrer.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Referral Status Card */}
                <div
                    className={`${CardStyle} lg:col-span-2 bg-indigo-50 border-2 border-indigo-200`}
                >
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b pb-2">
                        🏆 Your Referral System
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <p className="text-gray-700 text-lg font-medium">
                            Total Successful Referrals:
                        </p>
                        <span className="text-4xl font-extrabold text-indigo-600 p-2 bg-indigo-100 rounded-lg shadow-inner">
                            {currentUser.referral_count}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-700 font-medium">
                            Your Unique Code:
                        </p>
                        <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg text-lg font-mono tracking-wider select-all">
                            {referralCode}
                        </code>

                        <p className="text-gray-700 font-medium pt-2">
                            Shareable Referral Link:
                        </p>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 items-stretch">
                            <input
                                type="text"
                                readOnly
                                value={referralLink}
                                className="flex-grow bg-white border border-gray-300 p-3 rounded-lg text-sm text-gray-700 truncate"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={ButtonStyle}
                                disabled={copyStatus}
                            >
                                {copyStatus ? "Copied!" : "Copy Link"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
