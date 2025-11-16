// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import api from "../services/api";
// import { logout, setUser } from "../features/auth/authSlice.js"; // CORRECT: Only includes setUser and logout

// // This component runs once on app load to restore user session from localStorage
// const AuthInitializer = ({ children }) => {
//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);

//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         // If we have a token but haven't loaded the user data into Redux yet, fetch data.
//         if (token && !user) {
//             const fetchUser = async () => {
//                 try {
//                     // The API interceptor automatically attaches the token
//                     const response = await api.get("/user");

//                     // Restore user state (name, role, referral info)
//                     dispatch(setUser(response.data));
//                 } catch (error) {
//                     // If the token is expired or invalid (e.g., receives 401), clear the session
//                     console.error(
//                         "Failed to fetch user (Token expired/invalid). Clearing session.",
//                         error
//                     );
//                     dispatch(logout());
//                 }
//             };
//             fetchUser();
//         }
//     }, [dispatch, user]); // Depend only on dispatch and user state

//     // Render the children (the rest of the application) immediately.
//     return <>{children}</>;
// };

// export default AuthInitializer;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { logout, setUser } from "../features/auth/authSlice.js";

// This component runs once on app load to restore user session from localStorage
const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();
    // We rely on the token being in localStorage and the user object/ready flag
    const { user, isAuthReady } = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // 1. If we have a token AND user data is missing AND the auth check isn't complete yet, fetch data.
        // This handles the hard refresh case and prevents redundant fetches.
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

    // Render the children (the rest of the application) immediately.
    // The ProtectedRoute handles showing the spinner until isAuthReady is true.
    return <>{children}</>;
};

export default AuthInitializer;
