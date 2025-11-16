import React from "react";
import DataTable from "react-data-table-component";
import api from "../../../services/api";

const UserTable = ({
    users,
    totalRows,
    loading,
    onEdit,
    onDataChange,
    handlePageChange,
    handlePerRowsChange,
}) => {
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        try {
            await api.delete(`/admin/users/${id}`);
            onDataChange(); // Notify parent to refresh list
        } catch (error) {
            console.error(
                "Failed to delete user:",
                error.response?.data?.message || error.message
            );
            alert("Failed to delete user.");
        }
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            grow: 1.5,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
            grow: 2,
        },
        {
            name: "Role",
            selector: (row) => row.role,
            sortable: true,
            cell: (row) => (
                <span
                    className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                        row.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    {row.role}
                </span>
            ),
            width: "100px",
        },
        {
            name: "Referral Code",
            selector: (row) => row.referral_code,
            width: "150px",
        },
        {
            name: "Referrals",
            selector: (row) => row.referral_count,
            sortable: true,
            width: "100px",
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 border border-blue-600 rounded-md transition duration-150 text-xs"
                        onClick={() => onEdit(row)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded-md transition duration-150 text-xs"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            button: true,
            allowOverflow: true,
            width: "160px",
        },
    ];

    // Custom Spinner for RDTC loading state (Tailwind only)
    const CustomLoader = (
        <div className="p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
        </div>
    );

    return (
        <DataTable
            columns={columns}
            data={users}
            progressPending={loading}
            progressComponent={CustomLoader}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            pointerOnHover
            className="rounded-lg shadow-xl" // Apply Tailwind styles to the outer container
        />
    );
};

export default UserTable;
