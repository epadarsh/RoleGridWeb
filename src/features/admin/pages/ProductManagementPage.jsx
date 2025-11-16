import React, { useState, useEffect, useRef } from "react";

import api from "../../../services/api";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");

    const debounceRef = useRef(null);
    const lastParamsRef = useRef(null);
    const abortControllerRef = useRef(null);

    // --- Tailwind Utility Components/Styles ---
    const InputStyle =
        "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";

    const fetchProductsFromServer = async ({
        page,
        rowsPerPage,
        searchQuery,
        signal,
    }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/admin/products`, {
                params: {
                    page,
                    per_page: rowsPerPage,
                    search: searchQuery,
                },
                signal,
            });

            setProducts(res.data.data ?? []);
            setTotalRows(res.data.total ?? 0);
            setCurrentPage(res.data.current_page ?? page);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") {
                return;
            }
            console.error("Error Fetching Products:-->", err);
            setError(
                "Failed to fetch products. Check API status and authorization."
            );
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = { page: currentPage, per_page: perPage, search };

        const paramsKey = JSON.stringify(params);
        if (lastParamsRef.current === paramsKey) {
            return;
        }

        // debounce for search typing
        const delay = search ? 500 : 0;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        const doFetch = () => {
            // create a new abort controller for this request
            const controller = new AbortController();
            abortControllerRef.current = controller;

            fetchProductsFromServer({
                page: currentPage,
                rowsPerPage: perPage,
                searchQuery: search,
                signal: controller.signal,
            }).then(() => {
                // set last params only after a successful attempt (so repeated identical attempts are blocked)
                lastParamsRef.current = paramsKey;
            });
        };

        if (delay > 0) {
            debounceRef.current = setTimeout(doFetch, delay);
        } else {
            doFetch();
        }

        return () => {
            // cleanup debounce timer and abort ongoing request when deps change or component unmounts
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [currentPage, perPage, search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleDataChange = (updatedProduct = null) => {
        if (updatedProduct) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === updatedProduct.id ? updatedProduct : p
                )
            );
            return;
        }
        lastParamsRef.current = null;

        setTimeout(() => setCurrentPage((p) => p), 0);
    };

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
                onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);

                    lastParamsRef.current = null;
                }}
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
