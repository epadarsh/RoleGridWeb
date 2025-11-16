import React, { useState, useEffect, useRef } from "react";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import api from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";

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

    // Refs for debounce, abort and last params to prevent duplicate identical fetches
    const debounceRef = useRef(null);
    const lastParamsRef = useRef(null); // store last fetched params as JSON
    const abortControllerRef = useRef(null);

    // --- Tailwind Utility Components/Styles ---
    const InputStyle =
        "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md";
    const AlertErrorStyle =
        "p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";

    // single fetch function (internal)
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
            // aborted requests are normal when user types / switches pages quickly
            if (err.name === "CanceledError" || err.name === "AbortError") {
                // ignore
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

    // Effect: watch currentPage, perPage, search
    useEffect(() => {
        // Prepare current params and compare with last fetched params to avoid duplicate calls
        const params = { page: currentPage, per_page: perPage, search };

        const paramsKey = JSON.stringify(params);
        // If last fetch used the same params, skip (this prevents duplicate fetches from StrictMode double-mount)
        if (lastParamsRef.current === paramsKey) {
            return;
        }

        // debounce for search typing
        const delay = search ? 500 : 0;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        // Abort previous request if any
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
    }, [currentPage, perPage, search]); // effect driven only by these states

    // Handlers update state only — effect does the fetching
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    // on save success: accept optional updated product to patch locally (avoid re-fetch)
    const handleDataChange = (updatedProduct = null) => {
        if (updatedProduct) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === updatedProduct.id ? updatedProduct : p
                )
            );
            return;
        }
        // fallback: force a re-fetch by clearing lastParamsRef so effect will run
        lastParamsRef.current = null;
        // trigger effect by setting same page (this will not re-run unless we change a dep)
        // simplest is to re-set currentPage to same value after microtick to trigger effect:
        setTimeout(() => setCurrentPage((p) => p), 0);
    };

    // Modal/Form Handlers
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
                    setCurrentPage(1); // reset page on new search
                    setSearch(e.target.value);
                    // also clear lastParamsRef so effect will run after debounce
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
