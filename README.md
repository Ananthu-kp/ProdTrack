# ProdTrack - Product Management System

A complete product management system built with Node.js, Express.js, MySQL, and vanilla JavaScript.

---

## 📋 Features Implemented

### ✅ **Authentication**
- Secure login system with bcrypt password hashing
- Session management using localStorage
- Logout functionality

### ✅ **Product Management (CRUD Operations)**
- **Create:** Add new products with image upload
- **Read:** View all products in a responsive grid layout
- **Update:** Edit existing products with all details
- **Delete:** Remove products with confirmation modal
- **Search:** Real-time product search by name, description, and category

### ✅ **File Upload**
- Image upload support for products
- File type validation (JPEG, PNG, GIF, WEBP)
- Size limit: 5MB
- Automatic image deletion when product is deleted or updated

### ✅ **Reports & Analytics**
- Total products count
- Total inventory value calculation
- Total items in stock
- Category-wise breakdown with counts

### ✅ **Additional Features**
- Form validation (frontend and backend)
- Toast notifications for user feedback
- Responsive design (mobile-friendly)
- Error handling throughout the application
- Clean and modern UI with consistent design

---

## 🛠️ Technology Stack

**Backend:**
- Node.js
- Express.js
- MySQL (mysql2)
- bcrypt (Password encryption)
- multer  (File upload)
- dotenv  (Environment variables)

**Frontend:**
- HTML5
- CSS3 (Modern responsive design)
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests

**Database:**
- MySQL 

---

## 📁 Project Structure

```
prodtrack/
├── config/
│   └── db.js                    # Database configuration and connection pool
├── controllers/
│   ├── authController.js        # Authentication logic (login)
│   └── productController.js     # Product CRUD operations
├── middleware/
│   └── upload.js                # Multer file upload configuration
├── public/
│   ├── css/
│   │   ├── style.css           # Login page styles
│   │   └── dashboard.css       # Dashboard styles
│   ├── js/
│   │   └── dashboard.js        # Dashboard JavaScript functionality
│   ├── uploads/                # Product images directory
│   │   └── default-product.jpg # Default product image
│   ├── login.html              # Login page
│   └── dashboard.html          # Dashboard page
├── routes/
│   ├── authRoutes.js           # Authentication routes
│   └── productRoutes.js        # Product API routes
├── scripts/
│   └── create-admin.js         # Script to create admin user
├── services/
│   ├── authService.js          # Authentication business logic
│   └── productService.js       # Product business logic
├── .env                        # Environment variables (configure before running)
├── app.js                      # Main application entry point
├── database.sql                # Database schema and structure
├── package.json                # Project dependencies
├── package-lock.json           # Dependency lock file
└── README.md                   # This file
```

---

## 🚀 Installation & Setup Instructions

### **Prerequisites**

Before running the application, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

### **Step 1: Extract Project Files**

Extract the submitted ZIP file to your desired location.

```bash
cd prodtrack
```

### **Step 2: Install Dependencies**

Install all required Node.js packages:

```bash
npm install
```

This will install:
- express
- mysql2
- bcrypt
- multer
- dotenv

### **Step 3: Setup MySQL Database**

1. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```
   (Enter your MySQL root password)

2. **Create and Import Database:**
   
   **Option A - Using MySQL Command Line:**
   ```bash
   mysql -u root -p < database.sql
   ```

   **Option B - From MySQL Shell:**
   ```sql
   source /path/to/prodtrack/database.sql
   ```

   **Option C - Manual Import:**
   ```sql
   CREATE DATABASE prodtrack;
   USE prodtrack;
   -- Then copy and paste the contents of database.sql
   ```

3. **Verify Database Creation:**
   ```sql
   SHOW DATABASES;  -- Should show 'prodtrack'
   USE prodtrack;
   SHOW TABLES;     -- Should show 'users' and 'products'
   ```

### **Step 4: Configure Environment Variables**

1. Open the `.env` file in the project root
2. Update the database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=prodtrack
PORT=3000
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

### **Step 5: Create Admin User**

Run the admin creation script to create the default admin account:

```bash
node scripts/create-admin.js
```

You should see:
```
✅ Admin user created successfully!
================================
Username: admin
Password: admin123
User ID: 1
================================
```

**Note:** If you see "⚠️ Admin user already exists!", that's fine - the admin is already created.

### **Step 6: Create Uploads Directory**

Ensure the uploads directory exists:

```bash
mkdir -p public/uploads
```

---

## ▶️ Running the Application

Start the server using:

```bash
node app.js
```

You should see:
```
Database connected successfully
Server running on http://localhost:3000
```

If you see "Database connection failed", check your MySQL credentials in `.env` file.

---

## 🔌 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |

### **Products**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/report` | Get analytics report |

---

## 📊 Database Schema

### **users Table**
```sql
id INT AUTO_INCREMENT PRIMARY KEY
username VARCHAR(50) NOT NULL UNIQUE
password VARCHAR(255) NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### **products Table**
```sql
id INT AUTO_INCREMENT PRIMARY KEY
name VARCHAR(100) NOT NULL
description TEXT
price DECIMAL(10, 2) NOT NULL
quantity INT NOT NULL DEFAULT 0
category VARCHAR(50)
image VARCHAR(255) DEFAULT 'default-product.jpg'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

---

## 🔒 Security Features

1. **Password Hashing:** All passwords are hashed using bcrypt with salt rounds of 10
2. **SQL Injection Prevention:** All database queries use parameterized statements
3. **File Type Validation:** Only image files (JPEG, PNG, GIF, WEBP) are allowed
4. **File Size Limit:** Maximum upload size of 5MB
5. **Input Validation:** Both frontend and backend validation for all forms
6. **Session Management:** User authentication verified on protected routes

---

## 👤 Default Login Credentials

**Username:** `admin`  
**Password:** `admin123`

---
