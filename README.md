## 🚀 Campus Inspection System

A scalable full-stack web application that digitizes and streamlines campus facility inspections. The platform enables technicians to record inspection data (water pressure, gas levels, equipment status, etc.) through a modern UI and automatically generates building-level reports — eliminating outdated paper-based processes.

The system includes:

- A responsive Angular SPA for technicians and administrators

- A secure Node.js/Express API with Prisma ORM

- A PostgreSQL database

- A fully deployed AWS architecture supporting CI/CD and zero-downtime updates

---

## 🌟 Features

✔ Digitizes campus inspection workflows

✔ Role-based authentication (JWT)

✔ Dynamic inspection checklists for admins

✔ Technician-friendly form UI

✔ Auto-generated building-level inspection reports

✔ Secure, scalable deployment using AWS

---

## Tech Stack

| Area | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Frontend** | Angular, TypeScript, Bootstrap |
| **Database** | PostgreSQL |
| **Cloud** | AWS S3, CloudFront, EC2 |
| **CI/CD** | GitHub Actions |
| **Package Manager**| npm |

---

## ☁️ Cloud Architecture

The system is deployed using a cloud-optimized, production-grade architecture:

### Frontend

- Hosted on Amazon S3 (static hosting)

- Delivered globally through CloudFront CDN


### Backend

- Deployed on EC2 (Amazon Linux 2)

- Runs Node.js API + Prisma + PM2 process manager

- Connected to PostgreSQL 


### CI/CD

A GitHub Actions pipeline automates deployment:

- On push → build

- SSH into EC2 → pull latest backend → npm install → Prisma generate → restart PM2

- Achieves zero-downtime deployments

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

---

## 🚀 Deployment (AWS Overview)
### Frontend Deployment

1. Build an Angular project

2. Upload to S3

3. Configure CloudFront distribution

4. Update invalidations on each deployment

### Backend Deployment

1. Launch EC2 instance

2. Install Node, Git, PM2

3. Pull backend repo from GitHub

4. Start the server with PM2

5. Configure reverse proxy (Nginx)

### CI/CD Workflow
Backend → SSH into EC2 + auto-update + PM2 reload
