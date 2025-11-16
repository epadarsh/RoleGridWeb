import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js"; // Ensure this path is correct

// Ensure Tailwind's CSS imports here (if you use an index.css file)

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* The Provider component is mandatory.
      It makes the Redux store available to any nested components (like Navbar)
      that call useSelector() or useDispatch().
    */}
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
