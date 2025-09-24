# FullStack E-commerce (MERN + MVC) 

**A full-featured e-commerce platform** built with the MERN stack (MongoDB, Express, React, Node.js), following the **MVC (Model–View–Controller)** architecture. Includes an Admin panel, user authentication, shopping cart, checkout, and responsive UI.

Includes an Admin panel, user authentication, shopping cart, checkout, server-side pagination, backend unit tests, and a fully responsive UI.

--- 
## Table of Contents 
- [About](#about) 
- [Features](#features) 
- [Architecture](#architecture) 
- [Tech Stack](#tech-stack) 
- [Installation](#installation) 
- [Usage](#usage) 
- [Deployment](#deployment-vercel)
- [Docker Setup](#docker-setup)
- [Testing](#testing)
- [Project Structure](#project-structure) 


--- 

## About 
A modern e-commerce application where:
- Customers can browse products, add them to a cart, and complete checkout via Stripe.
- Admins can manage products, orders, and users through a dedicated dashboard.
  
The codebase follows a clean MVC design, making it easy to maintain and scale.

--- 
## Features 
- ✅ **MVC architecture** for clean separation of concerns
- ✅ **User Authentication & Authorization** with JWT
- ✅ **Product Management** with categories, images (Cloudinary)
- ✅ **Shopping Cart & Checkout** with real Stripe payment integration
- ✅ **Order Management** and status updates
- ✅ **Admin Dashboard** for product/user/order control
- ✅ **RESTful API** fully documented with **Swagger**
- ✅ **Responsive UI** built with TailwindCSS
- ✅ **Server-side** pagination & sorting for product collections
- ✅ **Backend unit tests** using Jest & Supertest
- ✅ **Dockerized** for local development & production deployment
- ✅ **Environment-based config** for local and production
--- 
## Architecture 
This project is structured with the **MVC** design pattern: 
- **Model**: Mongoose schemas & business logic  
- **View**: React front-end (Storefront & Admin)  
- **Controller**: Express controllers & routing
--- 
## Tech Stack 
- **Frontend**: React, TailwindCSS, Context API
- **Backend**: Node.js, Express.js, Jest (testing)
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: JWT
- **Payment**: Stripe
- **Storage**: Cloudinary (product images)
- **API Docs**: Swagger / OpenAPI 3
- **Containerization**: Docker & docker-compose
--- 
## Installation
```bash
# Clone the repository
git clone https://github.com/thuan2k4/FullStack-Ecommerce.git
cd FullStack-Ecommerce

# Backend setup
cd BE
npm install
npm run server  # or node server.js

# Frontend setup
cd FE
npm install
npm run dev
```

---
## Usage
- User: register/login → browse → add to cart → checkout
- Admin: login via admin credentials → manage products, users, orders

Optional: Create `.env` file with:
-  For Back-End `BE/.env`:

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

- For Front-End, Admin `FE/.env` and `Admin/.env`:
```bash
VITE_BACKEND_URL = "http://localhost:4000"
```
---
## Deployment Vercel
- Configure `vercel.json` for Admin/FE/BE
- Product URL:
    + API Docs: https://ecommerce-be-psi-five.vercel.app/api/docs
    + Front End: https://ecommerce-fe-zeta-one.vercel.app
    + Admin Panel: https://ecommer-admin-panel.vercel.app
---
## Docker Setup
- Run docker compose `docker-compose up --build`
- File `docker-compose.yml`:
```
version: '3.9'

services:
  backend:
    build: ./BE
    container_name: backend-server
    ports:
      - "4000:4000"
    env_file:
      - ./BE/.env
    depends_on:
      - mongo
    volumes:
      - ./BE:/usr/src/app
      - /usr/src/app/node_modules

  frontend:
    build: ./FE
    container_name: frontend-app
    ports:
      - "5173:5173"
    env_file:
      - ./FE/.env
    volumes:
      - ./FE:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - backend

  admin:
    build: ./Admin
    container_name: admin-app
    ports:
      - "5174:5173"
    env_file:
      - ./Admin/.env
    volumes:
      - ./Admin:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    container_name: mongo-db
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:

```
---
## Testing
- Backend tests are written with Jest and Supertest and (continue) use an in-memory MongoDB for isolation.
- Run all tests:
```bash
cd BE
npm test
```
---
## Project Structure
```
FullStack-Ecommerce/
├── BE/
|   ├── __tests__/
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
    │   ├── hooks/
    │   ├── context/
    │   └── pages/
    ├── .env
    ├── utils/
    └── public/
```
