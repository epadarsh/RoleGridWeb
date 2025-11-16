import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";

const InternalProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Tailwind Utility Components/Styles ---
    const CardStyle =
        "bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full";
    const AlertErrorStyle =
        "p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";

    // --- Data Fetching ---

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch from the protected Laravel endpoint
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (err) {
                console.error("Internal API fetch error:", err);
                setError(
                    "Failed to fetch internal products. Check session status."
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
                        📦 Your Internal Product View
                    </h1>
                    <p className="text-gray-600">
                        Inventory managed by the Admin panel.
                    </p>
                </div>

                {error && <div className={AlertErrorStyle}>{error}</div>}

                {loading ? (
                    <LoadingSpinner
                        className={"flex justify-center items-center py-16"}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className={CardStyle}>
                                {/* Image Container */}
                                <div className="h-48 p-4 flex items-center justify-center">
                                    <img
                                        src={
                                            product.image_url ||
                                            "https://placehold.co/200x200/cccccc/333333?text=No+Image"
                                        }
                                        alt={product.title}
                                        className="max-h-full max-w-full object-contain rounded-md"
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
                                        ${Number(product.price).toFixed(2)}
                                    </p>

                                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                        {product.description}
                                    </p>

                                    {/* Stock Indicator */}
                                    <div
                                        className={`text-sm font-semibold p-2 rounded-lg text-center ${
                                            product.stock > 10
                                                ? "bg-green-100 text-green-700"
                                                : product.stock > 0
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {product.stock > 0
                                            ? `Stock: ${product.stock} units`
                                            : "OUT OF STOCK"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No products are currently listed in the internal
                        catalog.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternalProductsPage;
