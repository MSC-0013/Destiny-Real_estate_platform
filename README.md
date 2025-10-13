# 🏡 Destiny Real Estate Platform

A **Full-Stack Real Estate Management Platform** built using **React (TypeScript)**, **Node.js**, and **MongoDB**, designed to simplify property management, job applications, repair requests, and construction tracking.

🌍 **Live Demo:** [https://destiny-real-estate-platform-472t.vercel.app](https://destiny-real-estate-platform-472t.vercel.app)

---

## ✨ Overview

**Destiny Real Estate Platform** connects homeowners, contractors, and property managers on a unified system.  
It handles everything from property listings to construction, repairs, analytics, and administrative dashboards — all in one elegant solution.

---

## 🚀 Features

✅ **User Authentication & Roles** – Secure login system with roles (Admin, Seller, Buyer, Contractor, Designer, Tenant)  
✅ **Property Management** – Add, edit, view, and delete properties  
✅ **Construction Management** – Manage ongoing projects and repairs  
✅ **Job Applications** – Apply for or post real estate jobs  
✅ **Order System** – View, track, and generate order reports in PDF  
✅ **Wishlist** – Save favorite properties  
✅ **Analytics Dashboard** – Revenue, income, and performance visualization  
✅ **Document Uploads** – Upload images and PDFs via Cloudinary  
✅ **Responsive UI** – Fully optimized for mobile and desktop  
✅ **Secure API** – Node.js backend with MongoDB integration  
✅ **PDF & Chart Generation** – Download reports and visualize data

---

## 🧠 Tech Stack

### 🌐 **Frontend**
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)
![ShadcnUI](https://img.shields.io/badge/shadcn/ui-UI-lightgrey)

### ⚙️ **Backend**
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![MongoDB](https://img.shields.io/bad   ge/MongoDB-Atlas-green?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image-blue?logo=cloudinary)
![Multer](https://img.shields.io/badge/Multer-FileUpload-orange)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)

---

## 🏠 Destiny Real Estate Platform - Folder Structure
```bash
📂 **Destiny-Real-Estate-Platform/**  
├─ 📂 **backend/** — 🧠 Handles all server-side logic and API endpoints.  
│  ├─ 📂 **controllers/** — 🎮 Contains business logic for each route (API actions).  
│  │  ├─ 📝 **constructionController.js** — Manages construction project creation and requests.  
│  │  ├─ 📝 **investmentController.js** — Handles user investment actions and tracking.  
│  │  ├─ 📝 **jobController.js** — Manages job applications and listings.  
│  │  ├─ 📝 **orderController.js** — Handles purchase orders and payments.  
│  │  ├─ 📝 **paymentController.js** — Integrates payment gateways and tracks transactions.  
│  │  ├─ 📝 **propertyController.js** — CRUD for real estate properties (add, update, delete).  
│  │  ├─ 📝 **userController.js** — Handles user signup, login, and profile management.  
│  │  ├─ 📝 **walletController.js** — Manages digital wallet balance and transactions.  
│  │  └─ 📝 **wishlistController.js** — Manages user wishlists for saved properties.  
│  ├─ 📂 **models/** — 🧩 Mongoose schemas defining data structure for MongoDB.  
│  │  ├─ 📝 **ConstructionProject.js** — Schema for construction projects.  
│  │  ├─ 📝 **Investment.js** — Schema for investments and profits.  
│  │  ├─ 📝 **JobApplication.js** — Schema for job-related data.  
│  │  ├─ 📝 **Order.js** — Schema for all orders and invoices.  
│  │  ├─ 📝 **Payment.js** — Schema for transactions and payment logs.  
│  │  ├─ 📝 **Property.js** — Schema for property details.  
│  │  ├─ 📝 **User.js** — Schema for users with roles (buyer, seller, etc.).  
│  │  ├─ 📝 **Wallet.js** — Schema for user wallet details and history.  
│  │  └─ 📝 **Wishlist.js** — Schema for saved property lists.  
│  ├─ 📂 **routes/** — 🛣️ Connects URLs to corresponding controller functions.  
│  │  ├─ 📝 **constructionRoutes.js** — API routes for construction features.  
│  │  ├─ 📝 **investmentRoutes.js** — Routes for investment tracking.  
│  │  ├─ 📝 **jobRoutes.js** — Routes for job listings and applications.  
│  │  ├─ 📝 **orderRoutes.js** — Handles order placement and retrieval.  
│  │  ├─ 📝 **paymentRoutes.js** — Integrates payment endpoints (UPI, card, etc.).  
│  │  ├─ 📝 **propertyRoutes.js** — CRUD endpoints for property data.  
│  │  ├─ 📝 **userRoutes.js** — Signup/login/profile routes.  
│  │  ├─ 📝 **walletRoutes.js** — Deposit/withdraw wallet routes.  
│  │  └─ 📝 **wishlistRoutes.js** — Wishlist management routes.  
│  ├─ 📂 **utils/** — ⚙️ Helper utilities for backend tasks.  
│  │  ├─ 🧰 **cloudinary.js** — Image uploading and hosting setup.  
│  │  └─ 🧰 **multer.js** — File upload middleware for backend routes.  
│  ├─ 🧠 **index.js** — Main Express app entry file; connects DB and routes.  
│  └─ 🔑 **.env** — Environment configuration (Mongo URI, API keys, etc.).  

---

├─ 📂 **src/** — 💻 Frontend (React + TypeScript + Vite) application.  
│  ├─ 📂 **components/** — 🧱 Reusable UI & logic components for various features.  
│  │  ├─ 📂 **analytics/** — 📊 Charts and PDF downloads for admin/investment tracking.  
│  │  │  ├─ 📝 **AdminAnalytics.tsx** — Displays overall analytics dashboard.  
│  │  │  ├─ 📝 **IncomeExpenseChart.tsx** — Shows wallet inflow/outflow chart.  
│  │  │  ├─ 📝 **Constructionpdf.tsx** — Exports project details into PDF format.  
│  │  │  └─ 📝 **RevenueChart.tsx** — Tracks revenue from property sales and rentals.  
│  │  ├─ 🧠 **Chatbot.tsx** — Interactive chatbot assistant for user guidance.  
│  │  ├─ 🏗️ **ConstructionRequestForm.tsx** — Form for requesting new construction.  
│  │  ├─ 🏢 **JobApplicationForm.tsx** — Used by workers/designers to apply for jobs.  
│  │  ├─ 🏠 **PropertyCard.tsx** — Displays individual property details visually.  
│  │  ├─ 💳 **WalletCard.tsx** — Shows wallet balance and transactions.  
│  │  ├─ 🔍 **SearchBar.tsx** — Global search for properties, projects, and jobs.  
│  │  ├─ 🧭 **Navbar.tsx** — Main navigation header with dynamic role-based links.  
│  │  ├─ 🧾 **DocumentUpload.tsx** — Used to upload verification or property documents.  
│  │  ├─ 📷 **ImageUpload.tsx** — Uploads property or profile images.  
│  │  ├─ 🧩 **ProfileImageUpload.tsx** — Uploads user profile picture.  
│  │  ├─ ⚙️ **RepairRequestForm.tsx** — Form for tenants/owners to request repairs.  
│  │  └─ ⚒️ **MaterialsTab.tsx** — Manages materials for construction sites.  
│  │  
│  │  📂 **ui/** — 🎨 Reusable ShadCN UI components (buttons, inputs, modals, etc.).  
│  │  _Used for consistent design system throughout the app (imported in all pages)._  
│
│  ├─ 📂 **contexts/** — 🧠 Global states for app-wide features.  
│  │  ├─ 🔐 **AuthContext.tsx** — Handles authentication and user session.  
│  │  ├─ 🏦 **WalletContext.tsx** — Tracks wallet balance and transactions.  
│  │  ├─ 🏠 **PropertyContext.tsx** — Manages property-related data across pages.  
│  │  ├─ 💼 **JobContext.tsx** — Stores job listings and applications.  
│  │  ├─ 🏗️ **ConstructionContext.tsx** — Tracks ongoing construction projects.  
│  │  ├─ 📈 **InvestContext.tsx** — Handles investments and returns.  
│  │  ├─ 💳 **PaymentContext.tsx** — Handles payments and verification.  
│  │  ├─ 🧾 **OrderContext.tsx** — Tracks purchase orders and receipts.  
│  │  └─ ❤️ **WishlistContext.tsx** — Stores favorite/saved properties.  
│
│  ├─ 📂 **hooks/** — 🪝 Custom React hooks.  
│  │  └─ 🧩 **use-mobile.tsx** — Detects mobile view and adjusts UI accordingly.  
│
│  ├─ 📂 **pages/** — 📑 Frontend pages for users and admins.  
│  │  ├─ 🏠 **Home.tsx** — Main landing page for browsing properties.  
│  │  ├─ 💳 **Wallet.tsx** — Wallet management interface.  
│  │  ├─ 💼 **Invest.tsx** — User investment dashboard.  
│  │  ├─ 🏗️ **Construction.tsx** — Shows all construction projects.  
│  │  ├─ 📊 **AdminDashboard.tsx** — Full admin control dashboard.  
│  │  ├─ 🧾 **Orders.tsx** — Displays past purchases and invoices.  
│  │  ├─ 🧱 **AddConstruction.tsx** — Admin adds new construction projects.  
│  │  ├─ 🏢 **AddProperty.tsx** — Add new property listings.  
│  │  ├─ 🔐 **Login.tsx** — User login page.  
│  │  ├─ 🧍 **Signup.tsx** — New user registration.  
│  │  ├─ 👤 **Profile.tsx** — User profile management.  
│  │  ├─ 🧭 **Properties.tsx** — Browse or filter all properties.  
│  │  ├─ 🧱 **PropertyDetails.tsx** — Detailed property info page.  
│  │  ├─ ❤️ **Wishlist.tsx** — Displays saved properties.  
│  │  ├─ 🧠 **Chat.tsx** — Real-time chat with property owners or agents.  
│  │  ├─ 🧑‍🔧 **ContractorDashboard.tsx** — Dashboard for contractors to track tasks.  
│  │  ├─ 🧑‍💼 **DesignerDashboard.tsx** — Dashboard for interior designers.  
│  │  ├─ 🧑‍🏫 **LandlordDashboard.tsx** — For landlords managing rentals.  
│  │  ├─ 🧑‍🏠 **TenantDashboard.tsx** — For tenants managing rent and repairs.  
│  │  ├─ 🧑‍💻 **SellerDashboard.tsx** — For sellers listing and managing properties.  
│  │  ├─ 🧑‍🔧 **WorkerDashboard.tsx** — Worker job management dashboard.  
│  │  ├─ 🧾 **PaymentTab.tsx** — Displays transactions and payment summaries.  
│  │  ├─ 🧱 **ConstructionDetails.tsx** — Displays full info about one construction.  
│  │  ├─ 🧮 **ConstructionChart.tsx** — Shows analytics for projects.  
│  │  ├─ 🧭 **Help.tsx** — Help and support page.  
│  │  └─ ⚠️ **NotFound.tsx** — 404 error page.  
│
│  ├─ 📂 **utils/** — 🧰 Helper utilities for frontend.  
│  │  ├─ ⚙️ **api.ts** — Axios instance with token headers for backend calls.  
│  │  ├─ 💾 **localStorageHelpers.ts** — Manages local storage and caching.  
│  │  ├─ 🗃️ **indexedDB.ts** — For offline data storage (Progressive Web App).  
│  │  └─ 🧾 **pdfGenerator.ts** — Generates downloadable PDF reports.  
│
│  ├─ 🧩 **App.tsx** — Root React component with routes and layout.  
│  └─ 🚀 **main.tsx** — Entry point that mounts the React app.  
│
├─ ⚙️ **vite.config.ts** — Vite build and dev configuration.  
├─ ⚙️ **eslint.config.js** — Code style and linting rules.  
├─ ⚙️ **postcss.config.js** — Tailwind and CSS processor settings.  
└─ 🧾 **index.html** — Root HTML entry file for the React app.  
```

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/destiny-real-estate-platform.git
cd destiny-real-estate-platform
```
2️⃣ Install Dependencies

Backend 
```bash
cd backend
npm install
```

Frontend
```bash
cd ../
npm install
```
3️⃣ Environment Variables (.env)

Create .env file inside the backend folder:

```bash
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
JWT_SECRET=your_jwt_secret
```

4️⃣ Run the App

Backend
```bash
cd backend
npm run dev
```

Frontend

```bash
cd ../
npm run dev
```

Now visit 👉 http://localhost:5173 or http://localhost:8080

📊 Analytics & Reports

Real-time construction analytics

Income & expense tracking

Revenue visualization

PDF generation for orders, invoices, and reports

📸 Example placeholders (replace with actual screenshots)








🧠 API Routes (Backend)
Route	Method	Description
/api/users	POST	Register or login user
/api/properties	GET	Get all properties
/api/construction	POST	Create construction project
/api/repairs	POST	Submit repair request
/api/orders	GET	Fetch all orders
/api/uploads	POST	Upload images/documents to Cloudinary
📦 Deployment
🔹 Frontend

Deployed on Vercel
👉 https://destiny-real-estate-platform-472t.vercel.app

🔹 Backend

Deploy on Render or Railway.app:

```bash
git push origin main
```

Add environment variables on the hosting platform (MongoDB, Cloudinary, JWT).

💡 Future Enhancements

AI-powered property recommendations

Live chat system for buyers & sellers

Payment gateway integration

Enhanced analytics (Power BI integration)

Admin-level reports export in CSV

🧑‍💻 Author

👋 Developed by: Your Name
💼 Student Developer | Data Science & Full-Stack Enthusiast
📧 Contact: your.email@example.com

🪪 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it under proper attribution.

❤️ Acknowledgments

Special thanks to all open-source projects that made this possible:
React, Express, MongoDB, TailwindCSS, Vite, ShadcnUI, and Cloudinary.

“Destiny Real Estate Platform — Modern technology for smart property management.”

Desgned by MSC