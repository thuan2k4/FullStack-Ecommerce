# FullStack E-commerce (MERN + MVC) 

**A full-featured e-commerce platform** built with the MERN stack (MongoDB, Express, React, Node.js), following the **MVC (Model–View–Controller)** architecture. Includes an Admin panel, user authentication, shopping cart, checkout, and responsive UI. 


--- 
## Table of Contents 
- [About](#about) 
- [Features](#features) 
- [Architecture](#architecture) 
- [Tech Stack](#tech-stack) 
- [Installation](#installation) 
- [Usage](#usage) 
- [Project Structure](#project-structure) 


--- 

## About 
A modern e-commerce application where users can browse products, add to cart, and checkout. Admins can manage products, orders, and users. Built with a clean structure using MVC architecture to ensure maintainability and scalability. 

--- 
## Features 
- [x] **MVC architecture** (Model–View–Controller) — clear separation of concerns 
- [x] **User Authentication** (JWT-based registration & login) 
- [x] **CRUD operations** — manage products, categories, users 
- [x] **Shopping Cart** — add/remove items & quantity management
- [x] **Checkout & Order Processing** 
- [x] **Admin Dashboard** — manage products, orders, users 
- [x] **Responsive UI** — works well on mobile & desktop 
- [x] **RESTful API** for frontend–backend communication 
--- 
## Architecture 
This project is structured with the **MVC** design pattern: 
- **Model**: database schemas and data logic (e.g. Mongoose models) 
- **View**: React components rendering UI and handling user interaction 
- **Controller**: backend controllers managing logic and routing via Express 
--- 
## Tech Stack 
- **Frontend**: React, CSS Framework (Tailwind) 
- **Backend**: Node.js, Express.js 
- **Database**: MongoDB (via Mongoose) 
- **Authentication**: JWT (JSON Web Tokens) 
- **Styling & UI**: Tailwind 
- **Tools**: Postman (test API). 
--- 
## Installation
```bash
# Clone the repository
git clone https://github.com/thuan2k4/FullStack-Ecommerce.git
cd FullStack-Ecommerce

# Backend setup
cd backend
npm install
npm run server  # or node server.js

# Frontend setup
cd ../frontend
npm install
npm run dev
```

## Usage
- User: register/login → browse → add to cart → checkout
- Admin: login via admin credentials → manage products, users, orders

Optional: Create .env file with:
-  For Back-End:

```bash
MONGODB_URI = YOUR_MONGODB_URI
CLOUDINARY_API_KEY = YOUR_CLOUDINARY_API_KEY
CLOUDINARY_SECRET_KEY = YOUR_CLOUDINARY_SECRET_KEY
CLOUDINARY_NAME = YOUR_CLOUDINARY_NAME
JWT_SECRET = YOUR_JWT_SECRET
ADMIN_EMAIL = YOUR_ADMIN_EMAIL
ADMIN_PASSWORD = YOUR_ADMIN_PASSWORD
STRIPE_SECRET_KEY = YOUR_STRIPE_SECRET_KEY
TOKEN_EXPIRE=36000
```

- For Front-End, Admin:
```bash
VITE_BACKEND_URL = "http://localhost:4000"
```

## Project Structure
```
FullStack-Ecommerce/
├── BE/
|   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js (or index.js)
├── Admin/
|   ├── public/
|   ├── src/
|   │   ├── assets/
|   │   ├── components/
|   │   └── pages/
|   └── .env
└── FE/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   └──  pages/
    ├── .env
    ├── utils/
    └── public/
```
