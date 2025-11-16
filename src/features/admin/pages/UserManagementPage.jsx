import React, { useState, useEffect, useRef } from "react";
import UserTable from "../components/UserTable.jsx";
import UserForm from "../components/UserForm.jsx";
import api from "../../../services/api";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Server-side state required by RDTC
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");

    // local ref to track debounce timer
    const searchDebounceRef = useRef(null);

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

    // single fetch function (no useCallback needed because we drive via effect)
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
                signal, // AbortController signal
            });

            setUsers(response.data.data || []);
            setTotalRows(response.data.total || 0);
            setCurrentPage(response.data.current_page || page);
        } catch (err) {
            // if aborted, just return quietly
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

    // useEffect: fetch whenever currentPage, perPage change, or debounced search changes
    useEffect(() => {
        const controller = new AbortController();

        // For search debounce: if search changed, wait 500ms before fetching.
        // If search is empty we still fetch immediately (no delay).
        const doFetch = () =>
            fetchUsersFromServer({
                page: currentPage,
                rowsPerPage: perPage,
                searchQuery: search,
                signal: controller.signal,
            });

        // Clear previous debounce if any
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = null;
        }

        // Debounce only when search text changed recently:
        // If user typed something (non-empty) we debounce 500ms; else fetch immediately.
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
            // cleanup debounce timer and abort inflight request
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = null;
            }
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage, search]); // single effect driven by these states

    // Event handlers now only update state — effect triggers fetch
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleDataChange = () => {
        // re-trigger fetch by changing currentPage to itself (force effect) OR call a fresh fetch:
        // simplest: call the fetch directly (safe) but it will honor AbortController in the effect.
        // We'll just recall fetchUsersFromServer with current values (no race because effect's controller handles it).
        const controller = new AbortController();
        fetchUsersFromServer({
            page: currentPage,
            rowsPerPage: perPage,
            searchQuery: search,
            signal: controller.signal,
        });
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
                onChange={(e) => {
                    // reset to page 1 when search changes
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
