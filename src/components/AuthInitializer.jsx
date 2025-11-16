import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { logout, setUser } from "../features/auth/authSlice.js";

// This component runs once on app load to restore user session from localStorage
const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    const { user, isAuthReady } = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && !user && !isAuthReady) {
            const fetchUser = async () => {
                try {
                    // The API interceptor automatically attaches the token
                    const response = await api.get("/user");
                    // Success: Updates user and sets isAuthReady = true
                    dispatch(setUser(response.data));
                } catch (error) {
                    // Failure: Token is expired/invalid. Clears state and ensures isAuthReady = true
                    console.error(
                        "Failed to fetch user (Token expired/invalid). Clearing session.",
                        error
                    );
                    dispatch(logout());
                }
            };
            fetchUser();
        }
    }, [dispatch, user, isAuthReady]);

    return <>{children}</>;
};

export default AuthInitializer;
