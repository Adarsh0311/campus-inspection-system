# Campus Inspection System

This project is a full-stack web application designed to digitize and streamline campus facility inspections, replacing a manual paper-based workflow.

The backend is a Node.js API built with Express.js and Prisma, connected to a PostgreSQL database. The frontend is a single-page application built with Angular.

---

## Tech Stack

| Area | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL |
| **Frontend** | Angular, TypeScript, Bootstrap |
| **Package Manager**| npm |

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v20.x or later)
- **npm** (v10.x or later)
- **Angular CLI** (`npm install -g @angular/cli`)
- **PostgreSQL**

---

## Getting Started

Follow these steps to get the full application running on your local machine.

### **Step 1: Clone the Repository**
```bash
     git clone [https://github.com/adarsh0311/campus-inspection-system.git](https://github.com/adarsh0311/campus-inspection-system.git)
     cd campus-inspection-system
```


### Step 2: Backend Setup
- Navigate to the backend directory and install dependencies:

```Bash
  cd backend
  npm install
````



#### Set up the database connection:

- Create a .env file in the backend directory. Prisma uses this file for the database connection string
```
# backend/.env
# Replace 'username' and 'password' with your actual PostgreSQL credentials.

DATABASE_URL="postgres://username:password@localhost:5432/campus_inspection_db"
JWT_SECRET="your_jwt_secret_key"

```


- Run the database migration: This command will apply the schema to your database, creating all the necessary tables.

```Bash
  npx prisma migrate dev
````

#### Start the Development Server
```bash
  npm start
```


### Step 3: Frontend Setup
Navigate to the frontend directory from the root and install dependencies:
```bash
  cd frontend
  npm install
```

### Running the Application
```bash
  ng serve
```
This will start the Angular development server. The application will be accessible at http://localhost:4200.
