# MERN Task Management Application

A **Task Management System** built with the **MERN stack (MongoDB, Express, React, Node.js)** and styled with **Tailwind CSS**.  
This application allows users to create, edit, assign, and manage tasks with priority lists and status tracking.  
It includes **user authentication (signup/login/logout)** with role-based access (admin vs user).

---

## 🚀 Features

### 🔑 Authentication
- **Signup**: New users can register with name, email, password, and role.
- **Login**: Authenticates user with email and password, returns JWT token.
- **Logout**: Clears user session (localStorage) and redirects to login.
- **Role-based access**:
  - **Admin**: Can create/delete users, manage all tasks.
  - **User**: Can only see and manage their assigned tasks.

### ✅ Task Management
- Create new tasks (title, description, due date, priority, assigned user).
- Edit existing tasks.
- Delete tasks (with confirmation).
- Update task **status** (Pending, In-progress, Completed).
- Drag-and-drop tasks between **priority lists** (High / Medium / Low).
- View task details page.

### 📊 Task List
- Paginated task list (AJAX calls).
- Filter by priority/status.
- Responsive UI with **Tailwind CSS**.
- Visual priority indicators (color-coded: High 🔴, Medium 🟡, Low 🟢).

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router DOM, Axios, Tailwind CSS, @hello-pangea/dnd
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs
- **Other**: CORS, dotenv, nodemon

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/devanshkhatri12/MangetBrains.git
cd MangetBrains
```

### 2. Backend(Server)
```bash
cd server
npm install
```

> Create a `.env` file in `server/:`
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
#### Run server side
```bash
npm run dev
```

### 3. Frontend(Client)
```bash
cd ../client
npm install
```

> Create a `.env` file in `client/:`
```bash
VITE_API_URL=http://localhost:5000/api
```

#### Run client side
```bash
npm run dev
```
