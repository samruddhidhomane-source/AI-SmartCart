
# 🛒 AI SmartCart

An E-commerce Platform with Personalized Product Recommendations.

## 📌 Project Overview

AI SmartCart is a full-stack e-commerce web application that allows users to browse products, search and filter products, add products to cart and wishlist, and complete checkout using Razorpay test payments.

The platform also provides personalized product recommendations based on users' purchase history.

## 🚀 Features

- User Registration and Login
- JWT Authentication
- Role-Based Access (User and Admin)
- Product Listing and Product Details
- Search, Category and Brand Filtering
- Shopping Cart
- Wishlist
- Personalized Product Recommendations
- Admin Dashboard
- Product Management (Add, Edit, Delete)
- Order Management
- User Management
- Analytics Dashboard
- Razorpay Test Payment Integration

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript
- React Router
- React Icons

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

### Database
- MySQL

### Payment Integration
- Razorpay (Test Mode)

## 📂 Project Structure

```text
AI-SmartCart/
├── frontend/
│   ├── public/
│   └── src/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── seedAdmin.js
├── .gitignore
└── README.md
```

## ⚙️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/samruddhidhomane-source/AI-SmartCart.git
```

### 2. Start the Frontend

```bash
cd AI-SmartCart/frontend
npm install
npm run dev
```

### 3. Start the Backend

Open another terminal:

```bash
cd AI-SmartCart/backend
npm install
node server.js
```

### 4. Database Setup

- Create a MySQL database named `ai_smartcart`.
- Configure your database credentials in the backend `.env` file.
- Set up the required database tables.

## 🔐 Environment Variables

Create a `.env` file inside the backend folder and configure the required database, JWT, and Razorpay test credentials.

**Do not upload your `.env` file or secret keys to GitHub.**

## 👩‍💻 Developer

Developed as a full-stack E-commerce project using React, Node.js, Express.js, and MySQL.
