# E-Commerce API

## Overview

This is an E-Commerce API built with Node.js and Express. The API handles user authentication (signup and signin), product management, and role-based access for users, staff, vendors, and admins. The functionality includes creating products, viewing products, and managing products for specific roles.

### Features:
- **User Authentication**: Signup and signin functionality with JWT authentication and password hashing using bcrypt.
- **Role-Based Access Control**: Different roles (Admin, Staff, Vendor, User) with specific permissions for managing products.
- **Product Management**: Admin can create products, vendors can view and manage their products, and users can view products with additional vendor info.
- **In-Memory Storage**: For demonstration purposes, the app uses an in-memory array to store users and products. In a real-world scenario, this should be replaced by a database.

---

## API Endpoints:

### 1. **User Authentication**

- **POST /signup**: Creates a new user with a hashed password.  
  Request Body:  
  ```json
  {
    "name": "User Name",
    "username": "user123",
    "password": "securepassword",
    "role": "user"
  }

**POST /signin**: Authenticates a user and returns a JWT token.
Request Body:
```json
{
  "username": "user123",
  "password": "securepassword"
}
```

**Product Management**
**POST /products**: Admin only. Creates a new product. Request Body:

```json

{
  "name": "Product Name",
  "description": "Product description",
  "category": "Category Name",
  "start_date": "2023-01-01",
  "free_delivery": true,
  "delivery_amount": 0,
  "imageUrl": "product_image_url",
  "old_price": 100,
  "new_price": 90,
  "vendor_id": 1
}
```
**GET /products**: Returns all products available for viewing by all users.

**GET /products/:id**: Fetches product details by ID for admins, staff, and vendors.

**GET /user/products**: Users can view all products with vendor information and expiry time.

**POST /products/vendor/**:vendorId: Allows staff to add products for assigned vendors.

**GET /vendor/products/**:vendorId: Allows vendors to view their own products.

**Installation:**
1 **Clone the repository:**

```bash

git clone https://github.com/your-username/e-commerce-api.git
```

2 **Navigate into the project folder:**

```bash

cd e-commerce-api
```

3 **Install dependencies:**

```bash

npm install
```

4 **Start the server:**

```bash

npm start
```

The server will run on http://localhost:5000.

**Technologies Used:**
*Node.js*
*Express.js*
*JWT (JSON Web Token)*
*bcryptjs (for password hashing)*
*Moment.js (for date handling)*



