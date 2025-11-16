import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const FAKE_STORE_API = "https://fakestoreapi.com/products";

const PublicProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useSelector((state) => state.auth);

    // --- Tailwind Utility Components/Styles ---
    const CardStyle =
        "bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full";
    const AlertErrorStyle =
        "p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
    );

    // --- Data Fetching ---

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(FAKE_STORE_API);
                setProducts(response.data);
            } catch (err) {
                console.error("External API fetch error:", err);
                setError(
                    "Failed to fetch products from the external catalog. Please check your connection."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- Render Logic ---

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🛍️ Public Product Catalog
                    </h1>
                    {!isAuthenticated && (
                        <Link
                            to="/login"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md"
                        >
                            Login / Register
                        </Link>
                    )}
                </div>

                {error && <div className={AlertErrorStyle}>{error}</div>}

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className={CardStyle}>
                                {/* Image Container */}
                                <div className="h-48 p-4 flex items-center justify-center">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="max-h-full max-w-full object-contain rounded-md"
                                        onError={(e) => {
                                            // Fallback image handling
                                            e.target.onerror = null;
                                            e.target.src =
                                                "https://placehold.co/200x200/cccccc/333333?text=Image+Unavailable";
                                        }}
                                        loading="lazy"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3
                                        className="text-lg font-bold text-gray-900 mb-2 line-clamp-2"
                                        title={product.title}
                                    >
                                        {product.title}
                                    </h3>

                                    <p className="text-2xl font-extrabold text-green-600 mb-3 mt-auto">
                                        ${product.price.toFixed(2)}
                                    </p>

                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {product.description}
                                    </p>

                                    <button className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-150">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No products found in the external catalog.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProductsPage;
