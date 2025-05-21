# 📝 Multi-Page Form Application

## 📌 Objective

The goal of this project is to build a **multi-page form application** with a **React frontend** and a **Node.js backend**, utilizing **MongoDB** for data storage. This application demonstrates the ability to:

- Build user-friendly, multi-step forms  
- Manage application and form state  
- Perform client-side and server-side validation  
- Persist data across navigation  
- Create a backend API for form submission and data storage

---

## 🧩 Tech Stack

### Frontend
- **React (with Vite)**
- **React Router DOM** – Client-side routing
- **React Hook Form** – Form state management
- **Zod** – Schema-based validation (optional but recommended)
- **UI Library (e.g., ShadCN/UI)** – Optional for styling

### Backend
- **Node.js with Express**
- **MongoDB** – Database
- **Prisma ORM** – MongoDB data modeling and query handling
- **express-validator** – Server-side validation (or custom logic)

---

## 🌐 Application Structure

### 🔷 Page 1: Personal Information
Fields:
- Name  
- Email  
- Address Line 1  
- Address Line 2 (optional)  
- City  
- State  
- Zipcode  

### 🔷 Page 2: Educational Status
- Are you still studying? (Yes/No)  
  - If **Yes**: “Where are you studying?”  
  - If **No**: No additional input required  

### 🔷 Page 3: Projects
- Add one or more projects dynamically:
  - Project Name  
  - Project Description  
- Add/Remove project fields as needed

---

## 🔄 Navigation & Data Flow

- Users can **navigate forward and backward** through the form pages.  
- On every navigation (Next/Back), **data is saved to the backend**.  
- When returning to a page, previously entered data is **pre-filled**.  
- All pages implement **client-side validation** before navigation or saving.

---

## 🛡️ Validation

### Client-Side
- Form fields are validated before proceeding  
- Instant feedback to users  

### Server-Side
- Data is validated again before being saved in the database  
- Ensures security and data integrity  

---

## 📁 API Endpoints

Suggested backend endpoints:

- `POST /api/form/page1` – Save Personal Information  
- `POST /api/form/page2` – Save Educational Status  
- `POST /api/form/page3` – Save Projects  
- `GET /api/form/:userId` – Fetch existing form data for a user session  

---

## ✅ Core Features

- 🔁 Multi-step form navigation  
- 🔒 Client and server-side validation  
- 💾 Persistent data storage with MongoDB  
- 🎯 Dynamic form field generation (Projects)  
- 💡 Reusable components and scalable architecture  

---

## 📦 Suggested Libraries

| Purpose              | Frontend                             | Backend                  |
|----------------------|--------------------------------------|--------------------------|
| Form Handling        | `react-hook-form`                    | `express-validator`      |
| Schema Validation    | `zod`                                | Custom / `express-validator` |
| State Management     | `zustand`, `redux`, or Context API   | -                        |
| Routing              | `react-router-dom`                   | Express.js Routes        |
| Database Interaction | -                                    | `Prisma ORM` with MongoDB|

---

## 🚀 Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
