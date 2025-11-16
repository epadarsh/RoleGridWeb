import axios from "axios";
import store from "../redux/store";
import { showToast } from "../redux/toastSlice";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//  Response interceptor for global error handling and Toast messages
api.interceptors.response.use(
    (response) => response, // Pass successful responses
    (error) => {
        // Determine the error message
        let errorMessage = "An unexpected error occurred.";
        const status = error.response ? error.response.status : null;
        const data = error.response ? error.response.data : {};

        if (status === 403) {
            errorMessage =
                "Access denied. You do not have permission for this action.";
        } else if (status >= 400 && status < 500) {
            // Use message from server validation or generic client error
            errorMessage =
                data.message ||
                (data.errors
                    ? Object.values(data.errors).flat().join("; ")
                    : "Request failed due to invalid data.");
        } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
        }

        // Dispatch the toast message to Redux store
        if (
            status === 401 ||
            status === 403 ||
            (status >= 400 && status < 500) ||
            status >= 500
        ) {
            store.dispatch(
                showToast({
                    message: errorMessage,
                    severity: "error",
                })
            );
        }

        return Promise.reject(error);
    }
);

export default api;
