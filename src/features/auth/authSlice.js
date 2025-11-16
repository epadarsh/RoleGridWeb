import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    user: null, // We'll fetch and populate this after login/register
    isAuthenticated: !!localStorage.getItem("token"),
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
            localStorage.setItem("token", token);
        },
        // setUser: (state, action) => {
        //     state.user = action.payload; // For fetching user details after initial load
        // },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
        // ... other reducers
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
