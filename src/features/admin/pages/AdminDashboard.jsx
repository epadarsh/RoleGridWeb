import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const mockStats = [
    {
        title: "Total Users",
        value: "1,245",
        icon: (
            <svg
                className="w-8 h-8 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.523-.086-1.056-.27-1.558L17 20zm0-3s-1.071-1.442-2.38-2.585C13.52 13.886 10.375 13 7 13s-6.52 1.886-7.62 3.415C-.071 15.558-1 14.523-1 14v-2a3 3 0 013-3h18a3 3 0 013 3v2c0 .523-.086 1.056-.27 1.558L17 17zM12 11a4 4 0 100-8 4 4 0 000 8z"
                />
            </svg>
        ),
    },
    {
        title: "New Referrals (30 Days)",
        value: "45",
        icon: (
            <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8m-1 6a2 2 0 11-4 0 2 2 0 014 0zM7 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
    },
    {
        title: "Internal Products",
        value: "12",
        icon: (
            <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m8-4l-4-2m-4 6v8m4-8v8m-4-6h.01M12 12h.01M16 12h.01"
                />
            </svg>
        ),
    },
    {
        title: "Admins Active",
        value: "2",
        icon: (
            <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6-6v2m12-2v2M13 7H7M15 11h.01M17 15h.01M12 22s-8 0-8-14h16c0 14-8 14-8 14z"
                />
            </svg>
        ),
    },
];

const AdminDashboard = () => {
    const user = useSelector((state) => state.auth.user);

    // Tailwind Style Definitions
    const LinkCardStyle =
        "bg-white p-6 rounded-xl shadow-lg hover:bg-gray-50 transition duration-200 border border-gray-100 flex items-center space-x-4";
    const StatCardStyle =
        "bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500 hover:shadow-xl transition duration-300";

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Admin Panel Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
                Welcome back, {user?.name || "Administrator"}. Manage system
                resources below.
            </p>

            {/*  Key Metrics  */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Key Metrics (Mock)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {mockStats.map((stat) => (
                    <div key={stat.title} className={StatCardStyle}>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-100 rounded-full">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-lg font-medium text-gray-500">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/*  Quick Actions / Navigation  */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Quick Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Management Link */}
                <Link to="/admin/users" className={LinkCardStyle}>
                    <div className="p-4 bg-indigo-500 rounded-lg text-white">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a4 4 0 014-4h10a4 4 0 014 4v2a1 1 0 01-1 1h-3z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            User Management
                        </h3>
                        <p className="text-gray-500">
                            View, Add, Edit, and Delete all registered users and
                            assign roles.
                        </p>
                    </div>
                </Link>

                {/* Product Management Link */}
                <Link to="/admin/products" className={LinkCardStyle}>
                    <div className="p-4 bg-green-500 rounded-lg text-white">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Product Management
                        </h3>
                        <p className="text-gray-500">
                            Manage internal product inventory, pricing, and
                            stock levels (Internal CRUD).
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
