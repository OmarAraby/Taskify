# 📌 Taskify – Task Management API

A powerful and modular **task management backend API** built with Node.js and Express, enabling users to manage tasks with advanced features like categories, tags, priorities, status tracking, and real-time notifications.

---

## 🚀 Features

- 🔐 **User Authentication** – Register, login, reset password, and manage profile securely using JWT
- ✅ **Task Management** – Full CRUD operations with rich metadata
- 🏷️ **Categories & Tags** – Organize tasks using custom labels and colors
- ⚠️ **Task Prioritization** – Assign low, medium, or high priority
- 🔄 **Status Tracking** – Track task progress (todo, in-progress, completed, overdue, archived)
- ⏰ **Due Date Reminders** – Real-time + email notifications for upcoming deadlines
- 📊 **Dashboard Statistics** – Visual overview of task stats and progress
- 🔍 **Search & Filtering** – Find tasks by text, date, priority, or status
- 📄 **Pagination** – Efficient loading of large task sets

---

## 🧰 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Email**: Nodemailer (via Gmail)
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Scheduling**: node-schedule
- **Security**: bcrypt (password hashing)

---

## 📁 Project Structure
  

```

├── db/                     # Database connection

├── src/

│   ├── middlewares/        # Express middlewares

│   │   ├── auth.middleware.js

│   │   └── errorHandler.middleware.js

│   ├── modules/            # Feature modules

│   │   ├── Category/       # Category module

│   │   ├── Tag/            # Tag module

│   │   ├── Task/           # Task module

│   │   └── User/           # User module

│   ├── services/           # External services

│   │   ├── cloudinary.service.js

│   │   ├── email.service.js

│   │   └── notification.service.js

│   └── utils/              # Utility functions

│       ├── apiFeatures.js  # API features for filtering, sorting, etc.

│       ├── errors/         # Custom error handlers

│       ├── multer.js       # File upload configuration

│       ├── notification.js # Notification singleton

│       └── validation/     # Schema validation

├── .env                    # Environment variables (not tracked in git)

├── .gitignore              # Git ignore file

├── index.js                # Application entry point

└── package.json            # Project dependencies

```

  

---

## 🧪 Getting Started

### ✅ Prerequisites

- Node.js v20+
- MongoDB (local or Atlas)
- Gmail account (for notifications)
- Cloudinary account (for image uploads)

### 📥 Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd backend
```

1. **Install dependencies**
    
```bash
npm install
```
    
3. **Create `.env` file**
    
    ```env
    PORT=9999
    MONGODB_URI=mongodb://localhost:27017/taskify
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRATION=7d
    
    # Gmail Config
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    
    # Frontend URL for password reset
    FRONTEND_URL=http://localhost:3000
    
    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
    
4. **Start the dev server**
    
    ```bash
    npm run dev
    ```
    

---

## 📡 API Endpoints Overview

### 🔐 Authentication

|Method|Endpoint|Description|
|---|---|---|
|POST|`/api/auth/register`|Register a new user|
|POST|`/api/auth/login`|Login and receive JWT|
|POST|`/api/auth/forgot-password`|Send password reset link|
|POST|`/api/auth/reset-password/:resetToken`|Reset password via token|
|PATCH|`/api/auth/change-password`|Change current password|
|PUT|`/api/auth/update-profile`|Update user profile|
|DELETE|`/api/auth/profile-image`|Delete profile image|

### 🧩 Categories

|Method|Endpoint|Description|
|---|---|---|
|POST|`/api/category/add-category`|Create category|
|GET|`/api/category/AllCategory`|Fetch all categories|
|GET|`/api/category/:id`|Fetch single category|
|PUT|`/api/category/:id`|Update category|
|DELETE|`/api/category/:id`|Delete category|

### 🏷️ Tags

|Method|Endpoint|Description|
|---|---|---|
|POST|`/api/tag`|Create new tag|
|GET|`/api/tag`|Get all tags|
|GET|`/api/tag/:id`|Get single tag|
|PUT|`/api/tag/:id`|Update tag|
|DELETE|`/api/tag/:id`|Delete tag|

### 📋 Tasks

|Method|Endpoint|Description|
|---|---|---|
|POST|`/api/task`|Create a task|
|GET|`/api/task`|Get all tasks (with filters)|
|GET|`/api/task/:id`|Get task by ID|
|PUT|`/api/task/:id`|Update task|
|DELETE|`/api/task/:id`|Delete task|
|PATCH|`/api/task/:id/status`|Update task status|
|GET|`/api/task/stats`|Get dashboard stats|

---

## 🔑 Authentication Guide

All protected routes require a valid JWT token.

### 🔐 How to use:

1. Register/Login to receive your token.
    
2. Include it in the `Authorization` header:
    
    ```
    Authorization: Bearer <your_token>
    ```
    

### 📦 Token Payload

- `id`: User ID
    
- `username`
    
- `email`
    
- `role`: `user` or `admin`
    
- `loggedAt`: Login timestamp
    

### 🔐 Password Security

- Hashed using **bcrypt**
    
- Reset tokens expire in 10 minutes
    
- Strong password rules enforced (length, character types)
    

---

## 📢 Real-time Notifications

The app uses **Socket.IO** to notify users of:

- ⏰ Tasks due within 1 hour
    
- 📧 Fallback to email if user is offline
    

### Frontend connection:

```js
const socket = io('http://localhost:9999');

socket.emit('authenticate', userId);

socket.on('notification', (notification) => {
  console.log(notification);
  // Display in UI
});
```

---

## 🧠 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

This project is licensed under the MIT License.`

---
