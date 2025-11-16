import React from "react";

const LoadingSpinner = (props) => {
    const { className } = props;
    return (
        <div className={className}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-4border-t-4 border-indigo-500 mx-auto block mt-10"></div>
        </div>
    );
};

export default LoadingSpinner;
