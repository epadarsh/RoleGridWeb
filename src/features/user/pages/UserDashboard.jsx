import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../services/api";
import { setUser } from "../../auth/authSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { FRONTEND_BASE_URL } from "../../../utils/constants";

const UserDashboard = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copyStatus, setCopyStatus] = useState(false);

    const CardStyle =
        "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";
    const ButtonStyle =
        "bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md disabled:opacity-50";

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/user");

            dispatch(setUser(response.data));
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
        if (!currentUser) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [currentUser, fetchUserData]);

    const referralCode = currentUser?.referral_code;
    const referralLink = referralCode
        ? `${FRONTEND_BASE_URL}/register?ref=${referralCode}`
        : "";

    const handleCopyLink = () => {
        if (referralLink) {
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
            setTimeout(() => setCopyStatus(false), 2000);
        }
    };

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
