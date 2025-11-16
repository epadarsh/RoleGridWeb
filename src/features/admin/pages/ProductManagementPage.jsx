import React, { useState, useEffect, useCallback } from "react";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import api from "../../../services/api";

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

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
    const fetchProducts = useCallback(
        async (page, rowsPerPage, searchQuery) => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/admin/products`, {
                    params: {
                        page: page,
                        per_page: rowsPerPage,
                        search: searchQuery,
                        // Add sort_by & sort_dir here if implementing column sorting
                    },
                });

                setProducts(response.data.data);
                setTotalRows(response.data.total);
                setCurrentPage(response.data.current_page);
            } catch (err) {
                console.log("Error Fetching Products:-->", err);

                setError(
                    "Failed to fetch products. Check API status and authorization."
                );
                setProducts([]); // Clear data on error
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // 2. Initial Data Fetch / Search Trigger
    useEffect(() => {
        // Debounce search input
        const handler = setTimeout(() => {
            fetchProducts(1, perPage, search); // Reset to page 1 on new search
        }, 500);

        return () => clearTimeout(handler);
    }, [search, perPage, fetchProducts]);

    // 3. Handlers for RDTC
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProducts(page, perPage, search); // Fetch new page data
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchProducts(page, newPerPage, search); // Fetch with new perPage setting
    };

    const handleDataChange = () => {
        // Refresh the current page's data after Add/Edit/Delete
        fetchProducts(currentPage, perPage, search);
    };

    // 4. Modal/Form Handlers
    const handleOpenAdd = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    Internal Product Management
                </h1>
                <button className={ButtonPrimaryStyle} onClick={handleOpenAdd}>
                    Add New Product
                </button>
            </div>

            <input
                placeholder="Search Products by Title/Description..."
                type="text"
                className={`${InputStyle} mb-6`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && <div className={AlertErrorStyle}>{error}</div>}

            {loading && products.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <ProductTable
                    products={products}
                    totalRows={totalRows}
                    loading={loading}
                    onEdit={handleOpenEdit}
                    onDataChange={handleDataChange}
                    handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange}
                />
            )}

            <ProductForm
                open={isModalOpen}
                handleClose={handleCloseModal}
                currentProduct={currentProduct}
                onSaveSuccess={handleDataChange}
            />
        </div>
    );
};

export default ProductManagementPage;
