import React from "react";
import DataTable from "react-data-table-component";

import api from "../../../services/api";

const ProductTable = ({
    products,
    totalRows,
    loading,
    onEdit,
    onDataChange,
    handlePageChange,
    handlePerRowsChange,
}) => {
    // Tailwind Styles
    const EditButtonStyle =
        "text-blue-600 hover:text-blue-800 font-medium px-3 py-1 border border-blue-600 rounded-md transition duration-150 text-xs";
    const DeleteButtonStyle =
        "bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded-md transition duration-150 text-xs";

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;

        try {
            await api.delete(`/admin/products/${id}`);
            onDataChange();
        } catch (error) {
            console.error(
                "Failed to delete product:",
                error.response?.data?.message || error.message
            );
            alert("Failed to delete product.");
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
            name: "Title",
            selector: (row) => row.title,
            sortable: true,
            grow: 2,
        },
        {
            name: "Price",
            selector: (row) => `$${Number(row.price).toFixed(2)}`,
            sortable: true,
            width: "100px",
        },
        {
            name: "Stock",
            selector: (row) => row.stock,
            sortable: true,
            width: "100px",
        },
        {
            name: "Image",
            cell: (row) =>
                row.image_url ? (
                    <img
                        src={row.image_url}
                        alt={row.title}
                        className="w-10 h-10 object-cover rounded my-1"
                    />
                ) : (
                    "N/A"
                ),
            ignoreRowClick: true,
            button: true,
            width: "80px",
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        className={EditButtonStyle}
                        onClick={() => onEdit(row)}
                    >
                        Edit
                    </button>
                    <button
                        className={DeleteButtonStyle}
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

    const CustomLoader = (
        <div className="p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
        </div>
    );

    return (
        <DataTable
            columns={columns}
            data={products}
            progressPending={loading}
            progressComponent={CustomLoader}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            pointerOnHover
            className="rounded-lg shadow-xl"
        />
    );
};

export default ProductTable;
