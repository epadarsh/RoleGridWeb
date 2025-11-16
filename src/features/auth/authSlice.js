import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    user: null,
    isAuthenticated: !!localStorage.getItem("token"),
    // 🚨 NEW STATE: Tracks if the initial token check/fetch is complete
    isAuthReady: !localStorage.getItem("token"),
    status: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isAuthReady = true; // Ready upon successful login
            localStorage.setItem("token", token);
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true; // Ensure this is true upon rehydration
            state.isAuthReady = true; // 🚨 Set ready after successful fetch
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAuthReady = true; // 🚨 Set ready after clearing session
            localStorage.removeItem("token");
        },
        // ... other reducers
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
