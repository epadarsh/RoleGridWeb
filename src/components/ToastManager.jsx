import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../redux/toastSlice";

const ToastManager = () => {
    const dispatch = useDispatch();
    const { message, severity, visible } = useSelector((state) => state.toast);

    // Auto-hide the toast after a few seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                dispatch(hideToast());
            }, 5000); // 5 seconds display time

            return () => clearTimeout(timer);
        }
    }, [visible, dispatch]);

    if (!visible || !message) {
        return null;
    }

    // Define color schemes based on severity
    const severityClasses = {
        error: "bg-red-500 border-red-700",
        success: "bg-green-500 border-green-700",
        warning: "bg-yellow-500 border-yellow-700",
        info: "bg-blue-500 border-blue-700",
    };

    const iconMap = {
        error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        warning:
            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.39 16c-.77 1.333.192 3 1.732 3z",
        info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    };

    return (
        <div className="fixed top-0 right-0 p-4 z-[200] pointer-events-none">
            <div
                className={`flex items-center w-full max-w-xs p-4 space-x-4 text-white rounded-lg shadow-lg border-l-8 transform transition-all duration-300 ${severityClasses[severity]}`}
                style={{
                    pointerEvents: "auto",
                    transform: visible
                        ? "translateY(1rem)"
                        : "translateY(-100%)",
                }}
            >
                <svg
                    className="w-6 h-6 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={iconMap[severity]}
                    />
                </svg>
                <div className="text-sm font-medium flex-1">{message}</div>
                <button
                    onClick={() => dispatch(hideToast())}
                    className="ml-4 -mr-1 transition duration-150 hover:bg-white hover:bg-opacity-20 p-1 rounded-full flex-shrink-0"
                >
                    <svg
                        className="w-5 h-5"
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
        </div>
    );
};

export default ToastManager;
