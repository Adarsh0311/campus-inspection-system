# Campus Inspection System - Backend API

A Node.js backend API for the Campus Inspection System built with Express.js, Prisma ORM, and a PostgreSQL database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: SQL (PostgreSQL)
- **Package Manager**: npm

## Prerequisites

- Node.js (version v20.19.4)
- npm (version 11.5.2)
- Database (PostgreSQL)

## Installation & Setup

### 1. Clone the Repository
```
git clone [https://github.com/adarsh0311/campus-inspection-system.git](https://github.com/adarsh0311/campus-inspection-system.git)

# Navigate to the backend directory
cd campus-inspection-system/backend
```
### 3. Database Setup
- Create a .env file in the backend directory. Prisma uses this file for the database connection string
```
# backend/.env
# Replace 'username' and 'password' with your actual PostgreSQL credentials.

DATABASE_URL="postgresql://username:password@localhost:5432/campus_inspection_db"
```
### 4. Run Database Migration
- This command will create the database if it doesn't exist and run all migrations to create your tables.
```bash
npx prisma migrate dev
```

### 5. Start the Development Server
```bash
npm start
```

- The server should now be running at  http://localhost:3000
