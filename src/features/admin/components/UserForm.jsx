import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "../../../services/api";
import { showToast } from "../../../redux/toastSlice";
import Modal from "../../../components/Modal";
import LoadingSpinner from "../../../components/LoadingSpinner";

// --- Reusable Tailwind Modal Component (for consistency) ---
// const Modal = ({ open, handleClose, title, children, actions }) => {
//     if (!open) return null;

//     return (
//         <div className="fixed inset-0 z-[100] bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 transition-opacity duration-300">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all sm:my-8 sm:align-middle">
//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         {title}
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="text-gray-400 hover:text-gray-600 transition duration-150 p-1"
//                         aria-label="Close"
//                     >
//                         <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M6 18L18 6M6 6l12 12"
//                             ></path>
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
//                     {children}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50 space-x-3">
//                     {actions}
//                 </div>
//             </div>
//         </div>
//     );
// };
// ------------------------------------------

const initialUserState = {
    name: "",
    email: "",
    role: "user", // Default role
    password: "",
    password_confirmation: "",
};

const UserForm = ({ open, handleClose, currentUser, onSaveSuccess }) => {
    const [formData, setFormData] = useState(initialUserState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const isEditMode = !!currentUser;

    // Syncs the form state when the currentUser prop changes
    useEffect(() => {
        if (currentUser) {
            // Load user details, but clear password fields
            setFormData({
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                password: "",
                password_confirmation: "",
            });
        } else {
            setFormData(initialUserState);
        }
        setError(null);
    }, [currentUser, open]);

    // Handler for all form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            password: formData.password || undefined, // Send password only if changed
            password_confirmation: formData.password_confirmation || undefined,
        };

        // Remove password keys if they are empty strings
        if (!payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        const endpoint = isEditMode
            ? `/admin/users/${currentUser.id}`
            : "/admin/users";
        const method = isEditMode ? "put" : "post";

        try {
            await api[method](endpoint, payload);
            dispatch(
                showToast({
                    message: isEditMode
                        ? `User "${currentUser.name}" Updated successfully.`
                        : `User Added successfully.`,
                    severity: "success",
                })
            );
            onSaveSuccess(); // Trigger list refresh in parent
            handleClose();
        } catch (err) {
            const serverMessage =
                err.response?.data?.message || err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join("; ")
                    : "Failed to save user.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    // Tailwind Utility Styles
    const InputStyle =
        "w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md disabled:opacity-50";
    const ButtonSecondaryStyle =
        "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 disabled:opacity-50";
    const AlertStyle =
        "p-3 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";
    // const LoadingSpinner = () => (
    //     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white inline-block mr-2"></div>
    // );

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title={
                isEditMode ? `Edit User: ${currentUser?.name}` : "Add New User"
            }
            actions={
                <>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={ButtonSecondaryStyle}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="user-form"
                        className={ButtonPrimaryStyle}
                        disabled={loading}
                    >
                        {loading && <LoadingSpinner />}
                        {isEditMode ? "Update User" : "Create User"}
                    </button>
                </>
            }
        >
            <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                {error && <div className={AlertStyle}>{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        required
                        className={InputStyle}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="User's Full Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        required
                        className={InputStyle}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="user@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        User Role
                    </label>
                    <select
                        name="role"
                        required
                        className={InputStyle}
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="pt-2">
                    <p className="text-sm font-bold text-gray-700 mb-2">
                        {isEditMode
                            ? "Change Password (Optional)"
                            : "Set Password"}
                    </p>
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required={!isEditMode}
                            className={InputStyle}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your strong password"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            name="password_confirmation"
                            type="password"
                            required={!isEditMode}
                            className={InputStyle}
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UserForm;
