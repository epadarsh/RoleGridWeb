import React, { useState, useEffect } from "react";

import api from "../../../services/api";
import Modal from "../../../components/Modal";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialProductState = {
    title: "",
    description: "",
    price: 0.01,
    stock: 0,
    image_url: "",
};

const ProductForm = ({ open, handleClose, currentProduct, onSaveSuccess }) => {
    const [formData, setFormData] = useState(initialProductState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!currentProduct;

    useEffect(() => {
        if (currentProduct) {
            setFormData(currentProduct);
        } else {
            setFormData(initialProductState);
        }
        setError(null);
    }, [currentProduct, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "stock" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = isEditMode
            ? `/admin/products/${formData.id}`
            : "/admin/products";
        const method = isEditMode ? "put" : "post";

        try {
            await api[method](endpoint, formData);
            onSaveSuccess();
            handleClose();
        } catch (err) {
            const serverMessage =
                err.response?.data?.message || err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join("; ")
                    : "Failed to save product. Check inputs.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    // Tailwind Utility Styles
    const InputStyle =
        "w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-sm";
    const ButtonPrimaryStyle =
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md disabled:opacity-50";
    const ButtonSecondaryStyle =
        "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 disabled:opacity-50";
    const AlertStyle =
        "p-3 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg";

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title={isEditMode ? "Edit Product" : "Add New Product"}
            actions={
                <>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={ButtonSecondaryStyle}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        className={ButtonPrimaryStyle}
                        disabled={loading}
                    >
                        {loading && <LoadingSpinner />}
                        {isEditMode ? "Update Product" : "Create Product"}
                    </button>
                </>
            }
        >
            <form
                id="product-form"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {error && <div className={AlertStyle}>{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        name="title"
                        type="text"
                        required
                        className={InputStyle}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Product Title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="3"
                        className={InputStyle}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description..."
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Price ($)
                        </label>
                        <input
                            name="price"
                            type="number"
                            required
                            className={InputStyle}
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0.01"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Stock Quantity
                        </label>
                        <input
                            name="stock"
                            type="number"
                            required
                            className={InputStyle}
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Image URL (Optional)
                    </label>
                    <input
                        name="image_url"
                        type="url"
                        className={InputStyle}
                        value={formData.image_url || ""}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ProductForm;
