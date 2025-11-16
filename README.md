## React Frontend: Referral & Role Management Interface

This is the official frontend interface for the Referral System application, built as a single-page application using React and Redux Toolkit. It communicates with the Laravel API backend running on http://localhost:8000/api.

## Setup & Launch

Ensure your Laravel backend is running on http://localhost:8000 before starting the frontend.

## Prerequisites

Node.js (18+)

npm or Yarn

Installation

# Clone the repository and navigate into the project directory as follows.

    git clone https://github.com/epadarsh/RoleGridWeb.git

    cd RoleGridWeb

Navigate to the frontend directory.

Install all dependencies:

    npm install

# OR

    yarn install

## Start the development server:

    npm run dev

## The application will typically launch at http://localhost:5173.

Key Configuration

The API base URL is configured in src/services/api.js. Verify the API_URL constant matches your backend URL:

// src/services/api.js
const API_URL = 'http://localhost:8000/api';

## Architecture and Design

The frontend follows a modern, feature-based architecture and relies on Tailwind CSS for styling, ensuring a high level of performance and customization.

1. Feature Structure

The code is organized by domain under src/features:

Feature Folder

Description

Key Components

auth

Handles registration, login, logout, and token management.

LoginPage.jsx, RegisterPage.jsx

user

Contains the authenticated user dashboard and internal product view.

UserDashboard.jsx, InternalProductsPage.jsx

admin

Contains all management views restricted to administrators.

UserManagementPage.jsx, ProductManagementPage.jsx

public

Contains the external product listing (Fake Store API(https://fakestoreapi.com/products)).

ProductsPage.jsx (Reused for both internal product listing and external product listing)

2. Global State Management (Redux Toolkit)

Authentication Flow (authSlice): Manages token, user object, and the isAuthReady flag.

Session Persistence: The AuthInitializer.jsx component runs on every page load to check localStorage for a token and re-hydrate the Redux state, preventing forced logouts on refresh.

Multi-Tab Logout: Uses the browser's storage event listener within AuthInitializer.jsx to force an immediate logout across all tabs when the token is destroyed in any single tab.

3. Routing and Security

ProtectedRoute.jsx: Blocks unauthorized users from accessing the /dashboard or /admin routes. It waits for isAuthReady to be true before deciding whether to allow access or redirect, eliminating the "redirect on refresh" race condition.

PublicRoute.jsx: Blocks authenticated users from accessing /login or /register pages, automatically redirecting them to the home page (/).

4. API Handling & UX

src/services/api.js: Uses Axios with global interceptors:

Request Interceptor: Automatically attaches the Sanctum Bearer token to all outbound requests and suppresses unnecessary OPTIONS preflight requests to keep the console clean.

Response Interceptor (Error): Catches all non-2xx status codes (401, 403, 500) and automatically dispatches a global error toast message.

ToastManager.jsx: Provides global, non-blocking visual feedback for all successful CRUD operations and API failures.

#### Test Credentials

Use these accounts (created by the backend seeder) for immediate testing:

### Admin user

email - admin@rolegrid.com
password - Admin@12

### Normal user 1

email - deric@rolegrid.com
password - Deric@12

### Normal user 2

email - embape@rolegrid.com
password - Embape@12

### Normal user 3

email - david@rolegrid.com
password - David@12
