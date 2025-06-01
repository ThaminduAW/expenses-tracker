# Expense Tracker Web Application

## Overview

**Expense Tracker** is a full-stack web application designed to help users efficiently track their subscriptions, recurring payments, and overall expenses. The app allows users to add, manage, and visualize their monthly and yearly payments, including subscriptions and installment payments (e.g., Afterpay). The app offers a user-friendly interface, notifications, and analytics to provide insights into spending patterns.

---

## Features

### 1. **User Authentication**
   - **Sign-Up**: Create a new account by registering with an email and password.
   - **Sign-In**: Login to the application with email and password.
   - **Password Reset**: Recover lost passwords using email verification.
   - **JWT Authentication**: Secure authentication and session management with JWT tokens.

### 2. **Track Subscriptions**
   - **Add Subscription**: Track monthly or yearly subscription payments (e.g., Netflix, Spotify, etc.).
   - **Manage Subscriptions**: View, update, and delete subscriptions.
   - **Monthly/Yearly Breakdown**: See a visual breakdown of subscriptions for the selected month or year.
   - **Reminders**: Get notifications for upcoming subscription renewals.

### 3. **Recurring Payment Tracking (e.g., Afterpay, Klarna)**
   - **Track Installments**: Add recurring payments like installment plans and track payment status.
   - **Payment Schedule**: View the next due date, amount remaining, and payment history.
   - **Installment Reminders**: Get notifications for upcoming installments.

### 4. **Analytics & Reports**
   - **Expense Reports**: Generate detailed reports for monthly and yearly spending.
   - **Visualization**: See your spending habits with graphical representations (charts and graphs).
   - **Comparison**: Compare spending across months or years to identify trends and areas to cut back.

---

## Tech Stack

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool that serves the React application in development and production.
- **Tailwind CSS**: A utility-first CSS framework to create modern and responsive designs.
- **React Router**: For handling routing and navigation between pages.
- **Axios**: For making API requests to the backend.

### Backend
- **Node.js**: JavaScript runtime for the server-side logic.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database to store user and payment data.
- **Mongoose**: ODM for MongoDB to interact with the database more easily.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.

### Deployment
- **Frontend**: Deployed on **Render** (or **Vercel**).
- **Backend**: Deployed on **Render** (or **Heroku**, **DigitalOcean**).

---

## Folder Structure

Here’s a brief overview of the folder structure of the project:

expense-tracker-app/
├── backend/                            # Backend (Node.js + Express)
│   ├── config/                         # Configuration files (e.g., DB connection, JWT secrets)
│   ├── controllers/                    # Business logic for handling requests
│   ├── middleware/                     # Middlewares for authentication, validation, etc.
│   ├── models/                         # Mongoose models for MongoDB
│   ├── routes/                         # API route definitions
│   ├── services/                       # Reusable functions (e.g., sending emails, notifications)
│   ├── utils/                          # Utility functions (e.g., generating JWT tokens)
│   ├── server.js                       # Main entry point for the backend (express server)
│   └── package.json                    # Backend dependencies and scripts
│
├── frontend/                           # Frontend (React + Vite)
│   ├── public/                         # Static assets (favicon, index.html)
│   ├── src/                            # React application source files
│   ├── .env                             # Frontend environment variables (API base URL)
│   ├── vite.config.js                  # Vite configuration (build and dev setup)
│   └── package.json                    # Frontend dependencies and scripts
│
├── .gitignore                          # Git ignore file
├── README.md                           # Project overview and instructions
└── docker-compose.yml                  # Optional: Docker setup for both frontend and backend

