import React from "react";

const Modal = ({ open, handleClose, title, children, actions }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all sm:my-8 sm:align-middle">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-150 p-1"
                        aria-label="Close"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50 space-x-3">
                    {actions}
                </div>
            </div>
        </div>
    );
};

export default Modal;
