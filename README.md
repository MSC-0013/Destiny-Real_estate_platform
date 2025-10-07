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
├─ 📂 **backend/**
│  ├─ 📂 **controllers/**
│  │  ├─ 📝 constructionController.js
│  │  ├─ 📝 jobController.js
│  │  ├─ 📝 orderController.js
│  │  └─ 📝 userController.js
│  ├─ 📂 **models/**
│  │  ├─ 📝 ConstructionProject.js
│  │  ├─ 📝 JobApplication.js
│  │  ├─ 📝 Order.js
│  │  ├─ 📝 RepairRequest.js
│  │  └─ 📝 User.js
│  ├─ 📂 **routes/**
│  │  ├─ 📝 constructionRoutes.js
│  │  ├─ 📝 jobRoutes.js
│  │  ├─ 📝 orderRoutes.js
│  │  ├─ 📝 uploadRoutes.js
│  │  └─ 📝 userRoutes.js
│  ├─ 📂 **utils/**
│  │  ├─ ⚙️ cloudinary.js
│  │  └─ ⚙️ multer.js
│  ├─ 📝 index.js
│  └─ 🔑 .env
│
├─ 📂 **src/**
│  ├─ 📂 **components/**
│  │  ├─ 📂 analytics/
│  │  │  ├─ 📝 AdminAnalyics.tsx
│  │  │  ├─ 📝 Constructionpdf.tsx
│  │  │  ├─ 📝 downloadOrderPDF.tsx
│  │  │  ├─ 📝 IncomeExpenseChart.tsx
│  │  │  ├─ 📝 Reapairform.tsx
│  │  │  └─ 📝 RevenueChart.tsx
│  │  ├─ 📂 ui/
│  │  │  ├─ 📝 accordion.tsx
│  │  │  ├─ 📝 alert-dialog.tsx
│  │  │  ├─ 📝 alert.tsx
│  │  │  ├─ 📝 aspect-ratio.tsx
│  │  │  ├─ 📝 avatar.tsx
│  │  │  ├─ 📝 badge.tsx
│  │  │  ├─ 📝 breadcrumb.tsx
│  │  │  ├─ 📝 button.tsx
│  │  │  ├─ 📝 calendar.tsx
│  │  │  ├─ 📝 card.tsx
│  │  │  ├─ 📝 carousel.tsx
│  │  │  ├─ 📝 chart.tsx
│  │  │  ├─ 📝 checkbox.tsx
│  │  │  ├─ 📝 collapsible.tsx
│  │  │  ├─ 📝 command.tsx
│  │  │  ├─ 📝 context-menu.tsx
│  │  │  ├─ 📝 dialog.tsx
│  │  │  ├─ 📝 drawer.tsx
│  │  │  ├─ 📝 dropdown-menu.tsx
│  │  │  ├─ 📝 form.tsx
│  │  │  ├─ 📝 hover-card.tsx
│  │  │  ├─ 📝 input-otp.tsx
│  │  │  ├─ 📝 input.tsx
│  │  │  ├─ 📝 label.tsx
│  │  │  ├─ 📝 menubar.tsx
│  │  │  ├─ 📝 navigation-menu.tsx
│  │  │  ├─ 📝 pagination.tsx
│  │  │  ├─ 📝 popover.tsx
│  │  │  ├─ 📝 progress.tsx
│  │  │  ├─ 📝 radio-group.tsx
│  │  │  ├─ 📝 resizable.tsx
│  │  │  ├─ 📝 scroll-area.tsx
│  │  │  ├─ 📝 select.tsx
│  │  │  ├─ 📝 separator.tsx
│  │  │  ├─ 📝 sheet.tsx
│  │  │  ├─ 📝 sidebar.tsx
│  │  │  ├─ 📝 skeleton.tsx
│  │  │  ├─ 📝 slider.tsx
│  │  │  ├─ 📝 sonner.tsx
│  │  │  ├─ 📝 switch.tsx
│  │  │  ├─ 📝 table.tsx
│  │  │  ├─ 📝 tabs.tsx
│  │  │  ├─ 📝 textarea.tsx
│  │  │  ├─ 📝 toast.tsx
│  │  │  ├─ 📝 toaster.tsx
│  │  │  ├─ 📝 toggle-group.tsx
│  │  │  ├─ 📝 toggle.tsx
│  │  │  └─ 📝 tooltip.tsx
│  │  ├─ 📝 Chatbot.tsx
│  │  ├─ 📝 ConstructionRequestForm.tsx
│  │  ├─ 📝 DocumentUpload.tsx
│  │  ├─ 📝 ImageUpload.tsx
│  │  ├─ 📝 JobApplicationForm.tsx
│  │  ├─ 📝 JobsDashboard.tsx
│  │  ├─ 📝 MaterialsTab.tsx
│  │  ├─ 📝 Navbar.tsx
│  │  ├─ 📝 ProfileImageUpload.tsx
│  │  └─ 📝 PropertyCard.tsx
│
│  ├─ 📂 **contexts/**
│  │  ├─ 📝 AuthContext.tsx
│  │  ├─ 📝 ConstructionContext.tsx
│  │  ├─ 📝 JobContext.tsx
│  │  ├─ 📝 OrderContext.tsx
│  │  ├─ 📝 PaymentContext.tsx
│  │  ├─ 📝 PropertyContext.tsx
│  │  └─ 📝 WishlistContext.tsx
│
│  ├─ 📂 **hooks/**
│  │  └─ 📝 use-mobile.tsx
│
│  ├─ 📂 **pages/**
│  │  ├─ 📝 AddConstruction.tsx
│  │  ├─ 📝 AddProperty.tsx
│  │  ├─ 📝 AdminDashboard.tsx
│  │  ├─ 📝 Construction.tsx
│  │  ├─ 📝 ConstructionChart.tsx
│  │  ├─ 📝 ConstructionDetails.tsx
│  │  ├─ 📝 ConstructionPage.tsx
│  │  ├─ 📝 ConstructionRentals.tsx
│  │  ├─ 📝 ConstructionSales.tsx
│  │  ├─ 📝 Contract.tsx
│  │  ├─ 📝 ContractorDashboard.tsx
│  │  ├─ 📝 DesignerDashboard.tsx
│  │  ├─ 📝 EditProperty.tsx
│  │  ├─ 📝 Help.tsx
│  │  ├─ 📝 Home.tsx
│  │  ├─ 📝 LandlordDashboard.tsx
│  │  ├─ 📝 Login.tsx
│  │  ├─ 📝 NotFound.tsx
│  │  ├─ 📝 Orders.tsx
│  │  ├─ 📝 PaymentTab.tsx
│  │  ├─ 📝 Profile.tsx
│  │  ├─ 📝 Properties.tsx
│  │  ├─ 📝 PropertyDetails.tsx
│  │  ├─ 📝 SellerDashboard.tsx
│  │  ├─ 📝 Signup.tsx
│  │  ├─ 📝 TenantDashboard.tsx
│  │  ├─ 📝 Wishlist.tsx
│  │  └─ 📝 WorkerDashboard.tsx
│
│  ├─ 📂 **utils/**
│  │  ├─ ⚙️ api.ts
│  │  ├─ ⚙️ indexedDB.ts
│  │  ├─ ⚙️ localStorageHelpers.ts
│  │  └─ ⚙️ pdfGenerator.ts
│
│  ├─ 📝 App.tsx
│  ├─ 📝 main.tsx
│
├─ ⚙️ eslint.config.js
├─ ⚙️ postcss.config.js
└─ ⚙️ vite.config.ts

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