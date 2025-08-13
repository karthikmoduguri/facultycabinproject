# 🎓 Faculty Cabin Management System

A comprehensive web application for managing faculty details, cabin bookings, and user roles in an academic environment. This project streamlines the process for students to book appointments with faculty, allows faculty to manage their schedules, and provides admins with tools to oversee users and bookings.

---

## 📜 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#Backend-project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## 📖 About the Project

The **Faculty Cabin Management System** is designed to make faculty-student interactions more efficient.  
Students can view faculty availability and book cabins, faculty can approve or reject bookings, and admins can manage all users and bookings.

---

## ✨ Features

- **Student Portal:**  
  - View available faculty cabins  
  - Book appointments with faculty  
  - Track booking status

- **Faculty Dashboard:**  
  - Manage cabin schedule  
  - Approve or reject student bookings  
  - View booking history

- **Admin Panel:**  
  - Add, update, or remove faculty and student users  
  - Monitor all bookings  
  - Generate reports

- **Notifications:**  
  - Email or in-app notifications for booking updates

- **Role-Based Access:**  
  - Secure login and access control for students, faculty, and admins

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Socket.IO (for real-time updates)
- **Backend:** Node.js, Express.js, MongoDB
- **Other:** JWT for authentication, RESTful APIs

---
## 📂 Backend Project Structure

```
backend/
├── src/
│   ├── controllers/         # Business logic for each feature (faculty, booking, user, etc.)
│   ├── models/              # Mongoose schemas for MongoDB collections
│   ├── routes/              # API route definitions for different modules
│   │   ├── faculty.route.js         # Faculty-related endpoints (CRUD, get by department, etc.)
│   │   ├── student.route.js         # Student-related endpoints (CRUD, get bookings, etc.)
│   │   ├── admin.route.js           # Admin actions (user management, reports)
│   │   ├── cabinbook.route.js       # Cabin booking endpoints (book, update, cancel, get bookings)
│   │   ├── department.route.js      # Department endpoints (CRUD, get faculties by department)
│   │   └── auth.route.js            # Authentication endpoints (login, register, JWT)
│   ├── index.js              # Main entry point for Express server
│   └── config/               # Configuration files (DB connection, environment setup)
│       └── db.js             # MongoDB connection logic
├── package.json
└── .env
```

---

## 🗂️ Routes Folder — Purpose of Each Route File

- **faculty.route.js**  
  Handles all faculty-related API endpoints:  
  - Create, read, update, delete faculty  
  - Get faculty by department  
  - Get all faculty details

- **student.route.js**  
  Handles student-related API endpoints:  
  - Create, read, update, delete student  
  - Get student bookings  
  - Get student profile

- **admin.route.js**  
  Handles admin actions:  
  - Manage users (add, update, delete faculty/students)  
  - Generate reports  
  - View system analytics

- **cabinbook.route.js**  
  Handles cabin booking logic:  
  - Book a cabin  
  - Update booking status  
  - Cancel booking  
  - Get bookings for faculty/student

- **department.route.js**  
  Handles department management:  
  - Create, update, delete department  
  - Get faculties by department

- **auth.route.js**  
  Handles authentication:  
  - User login  
  - User registration  
  - JWT token generation and verification

---

**Each route file connects HTTP endpoints to the appropriate controller functions, which contain the business logic

## 🛠 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karthikmoduguri/facultycabinproject.git
   cd faculty-cabin-project
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Configure environment variables:**  
   Add your MongoDB URI, JWT secret, and other sensitive info to `.env` files in both frontend and backend.

---

## 🔗 API Endpoints

- `POST /api/bookings` — Book a cabin
- `GET /api/faculty` — Get faculty details
- `PATCH /api/bookings/:id` — Update booking status
- `DELETE /api/bookings/:id` — Cancel booking
- `GET /api/admin/users` — Admin user management

---

## 🚀 Future Enhancements

- Mobile app version
- Calendar integration for faculty schedules
- Push notifications
- Advanced analytics for admins

---

## 👨‍💻 Author
Karthik Moduguri