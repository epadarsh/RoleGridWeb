// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/auth/authSlice";
// // import userReducer from "./userSlice"; // You'll create this

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         // Add other reducers here (e.g., admin, products)
//         // user: userReducer,
//     },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import toastReducer from "./toastSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        toast: toastReducer,
    },
});

export default store;
