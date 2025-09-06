🛒 E-Commerce Platform (Backend)
📌 Overview

This project is a backend system for an E-commerce application.
It provides APIs for managing products, user accounts, shopping carts, and orders.

Users can register, log in, browse products, add items to a cart, and make purchases.

Admins can manage product listings, view orders, and update order statuses.

✨ Features

🔐 User Authentication – registration & login with secure password hashing

🛍️ Product Catalogue – organized with categories

🛒 Shopping Cart – add/remove products before checkout

💳 Orders – place orders and track their status

👩‍💼 Admin Panel (API) – manage products & orders

🛠️ Tech Stack

Backend Framework: Node.js + Express

Database: MongoDB (with Mongoose)

Authentication: JWT (JSON Web Tokens)

File Uploads (optional): Multer + Cloudinary for product images

Environment Variables: dotenv

📂 Project Structure
Ecommerce-Backend/
│── config/         # DB connection, environment setup
│── controllers/    # Route controllers (business logic)
│── middleware/     # Auth & error handling
│── models/         # Mongoose schemas (User, Product, Order)
│── routes/         # API route definitions
│── uploads/        # Product images (if stored locally)
│── .env            # Environment variables
│── server.js       # Entry point

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

2️⃣ Install Dependencies
npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

4️⃣ Run the Server
npm run dev


Server will run on: http://localhost:5000

📡 API Endpoints
Authentication

POST /api/auth/register – Register new user

POST /api/auth/login – Login user

Products

GET /api/products – Get all products

GET /api/products/:id – Get single product

POST /api/products – Add new product (Admin only)

PUT /api/products/:id – Update product (Admin only)

DELETE /api/products/:id – Delete product (Admin only)

Cart & Orders

POST /api/cart – Add item to cart

GET /api/cart – View user’s cart

POST /api/orders – Place an order

GET /api/orders – Get user’s orders

PUT /api/orders/:id – Update order status (Admin only)

🔮 Future Improvements

Payment gateway integration (Stripe/PayPal)

Email notifications

Product reviews and ratings

Wishlist functionality

👨‍💻 Author

Built by [Oluwafe Ogunlana] 🚀
