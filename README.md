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
- multer (File upload)
- dotenv (Environment variables)

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

### **Step 1: Get the Project Files**

**Option A - Clone from GitHub (if available):**
```bash
git clone <repository-url>
cd prodtrack
```

**Option B - Download ZIP:**
1. Download the project ZIP file
2. Extract to your desired location
3. Navigate to the project folder:
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

1. **Start MySQL Service:**
   
   **Windows:**
   - Open Services → Start MySQL service

2. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL root password when prompted.

3. **Create and Import Database:**
   
   **Option A - Using Command Line (Recommended):**
   ```bash
   mysql -u root -p < database.sql
   ```
   
   **Option B - From MySQL Shell:**
   ```sql
   source /path/to/prodtrack/database.sql
   ```
   Replace `/path/to/prodtrack/` with your actual project path.
   
   **Option C - Manual Import:**
   ```sql
   CREATE DATABASE prodtrack;
   USE prodtrack;
   -- Then copy and paste the contents of database.sql
   ```

4. **Verify Database Creation:**
   ```sql
   SHOW DATABASES;
   ```
   You should see `prodtrack` in the list.
   
   ```sql
   USE prodtrack;
   SHOW TABLES;
   ```
   You should see `users` and `products` tables.

### **Step 4: Configure Environment Variables**

1. Open the `.env` file in the project root directory
2. Update the database credentials with your MySQL settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=prodtrack
PORT=3000
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

**Example:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=MyPassword123
DB_NAME=prodtrack
PORT=3000
```

### **Step 5: Create Admin User**

Run the admin creation script to create the default admin account:

```bash
node scripts/create-admin.js
```

**Expected Output:**
```
✅ Admin user created successfully!
================================
Username: admin
Password: admin123
User ID: 1
================================
```

**Note:** If you see "⚠️ Admin user already exists!", that's perfectly fine - it means the admin account is already created.

---

## ▶️ Running the Application

Start the server using:

```bash
node app.js
```

**Expected Output:**
```
Database connected successfully
Server running on http://localhost:3000
```

**If you see errors:**
- `Database connection failed` → Check MySQL credentials in `.env` file
- `Port 3000 already in use` → Change PORT in `.env` to 3001 or another available port
- `Cannot find module` → Run `npm install` again

---

## 🌐 Using the Application

### **Step 1: Access the Application**

Open your web browser and navigate to:
```
http://localhost:3000
```

### **Step 2: Login**

Use the default admin credentials:
- **Username:** `admin`
- **Password:** `admin123`

## 🔌 API Endpoints

### **Authentication**
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/login` | User login | `{ "username": "admin", "password": "admin123" }` |

### **Products**
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/products` | Get all products | - |
| GET | `/api/products/:id` | Get single product by ID | - |
| POST | `/api/products` | Create new product | FormData (name, price, quantity, category, description, image) |
| PUT | `/api/products/:id` | Update existing product | FormData (updated fields) |
| DELETE | `/api/products/:id` | Delete product | - |
| GET | `/api/products/report` | Get analytics report | - |


---

## 📊 Database Schema

### **users Table**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing primary key
- `username` - Unique username (max 50 characters)
- `password` - Hashed password using bcrypt
- `created_at` - Account creation timestamp

### **products Table**
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(50),
    image VARCHAR(255) DEFAULT 'default-product.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - Product name (max 100 characters, required)
- `description` - Product description (optional)
- `price` - Product price (decimal, 10 digits with 2 decimal places)
- `quantity` - Stock quantity (integer, default 0)
- `category` - Product category (max 50 characters)
- `image` - Image filename (default: 'default-product.jpg')
- `created_at` - Product creation timestamp
- `updated_at` - Last update timestamp (auto-updates)

---

## 👤 Default Login Credentials

**Username:** `admin`  
**Password:** `admin123`
---
