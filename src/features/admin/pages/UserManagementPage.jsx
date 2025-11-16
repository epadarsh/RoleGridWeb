import React, { useState, useEffect, useCallback } from "react";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import api from "../../../services/api";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Used for editing

    // Server-side state required by RDTC
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");

    // --- Tailwind Utility Components/Styles ---
    const InputStyle =
        "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";
    const LoadingSpinner = () => (
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-500 mx-auto block mt-10"></div>
    );

    // 1. Fetching Function (Handles all server-side parameters)
    const fetchUsers = useCallback(async (page, rowsPerPage, searchQuery) => {
        setLoading(true);
        setError(null);
        try {
            // Laravel API Endpoint: /api/admin/users?page=1&per_page=10&search=term
            const response = await api.get(`/admin/users`, {
                params: {
                    page: page,
                    per_page: rowsPerPage,
                    search: searchQuery,
                    // Sorting params can be added here
                },
            });

            // Update state using Laravel's paginated response structure
            setUsers(response.data.data);
            setTotalRows(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (err) {
            console.log("User Data Fetch Error:-->", err);

            setError(
                "Failed to fetch user data. Check API access and Admin role authorization."
            );
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Data Fetch / Search Trigger
    useEffect(() => {
        // Debounce search input
        const handler = setTimeout(() => {
            fetchUsers(1, perPage, search); // Reset to page 1 on new search
        }, 500);

        return () => clearTimeout(handler);
    }, [search, perPage, fetchUsers]); // Dependency array includes the memoized fetcher and state

    // Handlers for RDTC Pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchUsers(page, perPage, search); // Fetch new page data
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchUsers(page, newPerPage, search); // Fetch with new perPage setting
    };

    const handleDataChange = () => {
        // Refresh the current page's data after Add/Edit/Delete
        fetchUsers(currentPage, perPage, search);
    };

    // Modal/Form Handlers
    const handleOpenAdd = () => {
        setCurrentUser(null); // Clear for 'Add' mode
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user); // Set user for 'Edit' mode
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin User Management
                </h1>
                <button className={ButtonPrimaryStyle} onClick={handleOpenAdd}>
                    Add New User
                </button>
            </div>

            <input
                placeholder="Search Users by Name or Email..."
                type="text"
                className={`${InputStyle} mb-6`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && <div className={AlertErrorStyle}>{error}</div>}

            {loading && users.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <UserTable
                    users={users}
                    totalRows={totalRows}
                    loading={loading}
                    onEdit={handleOpenEdit}
                    onDataChange={handleDataChange}
                    handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange}
                />
            )}

            <UserForm
                open={isModalOpen}
                handleClose={handleCloseModal}
                currentUser={currentUser}
                onSaveSuccess={handleDataChange}
            />
        </div>
    );
};

export default UserManagementPage;
