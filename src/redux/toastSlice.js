import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: null,
    severity: "error", // Can be 'success', 'warning', 'info', 'error'
    visible: false,
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.message = action.payload.message;
            state.severity = action.payload.severity || "error";
            state.visible = true;
        },
        hideToast: (state) => {
            state.visible = false;
            state.message = null; // Clear message content
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
