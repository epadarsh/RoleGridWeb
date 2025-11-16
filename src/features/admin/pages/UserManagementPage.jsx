import React, { useState, useEffect, useRef } from "react";

import api from "../../../services/api";
import UserForm from "../components/UserForm.jsx";
import UserTable from "../components/UserTable.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");

    const searchDebounceRef = useRef(null);

    // --- Tailwind Utility Components/Styles ---
    const InputStyle =
        "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";

    const fetchUsersFromServer = async ({
        page,
        rowsPerPage,
        searchQuery,
        signal,
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/admin/users`, {
                params: {
                    page,
                    per_page: rowsPerPage,
                    search: searchQuery,
                },
                signal,
            });

            setUsers(response.data.data || []);
            setTotalRows(response.data.total || 0);
            setCurrentPage(response.data.current_page || page);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") {
                return;
            }
            console.error("User Data Fetch Error:-->", err);
            setError(
                "Failed to fetch user data. Check API access and Admin role authorization."
            );
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const doFetch = () =>
            fetchUsersFromServer({
                page: currentPage,
                rowsPerPage: perPage,
                searchQuery: search,
                signal: controller.signal,
            });

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = null;
        }

        const delay = search ? 500 : 0;
        if (delay > 0) {
            searchDebounceRef.current = setTimeout(() => {
                doFetch();
                searchDebounceRef.current = null;
            }, delay);
        } else {
            doFetch();
        }

        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = null;
            }
            controller.abort();
        };
    }, [currentPage, perPage, search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleDataChange = () => {
        const controller = new AbortController();
        fetchUsersFromServer({
            page: currentPage,
            rowsPerPage: perPage,
            searchQuery: search,
            signal: controller.signal,
        });
    };

    const handleOpenAdd = () => {
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user);
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
                onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);
                }}
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
