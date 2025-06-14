# Instagram Clone

A full-stack Instagram Clone project built using the MERN (MongoDB, Express.js, React.js, Node.js) stack with real-time chat functionality, profile management, and post management features.

![Screenshot 2025-06-09 164217](https://github.com/user-attachments/assets/d0e6f208-8abd-424c-8118-678402989ed9)
![Screenshot 2025-06-09 164150](https://github.com/user-attachments/assets/89106c38-4a2f-4868-8393-98f6cb38d18d)
![Screenshot 2025-06-09 164342](https://github.com/user-attachments/assets/a3dc1d20-df2b-49c5-bd78-e2149e65f69c)
![Screenshot 2025-06-09 164308](https://github.com/user-attachments/assets/df9029a2-c7cf-4f77-932e-c8e9e983283b)

---

## Features

- Real-time chat system
- Online/Offline user status
- User authentication (signup & login)
- Profile management (edit profile, upload profile photo)
- Create and delete posts
- Edit post captions
- Image upload functionality
- Secure password hashing (bcrypt)
- JWT-based authentication
- RESTful API backend
- Socket.IO integration for live chat
- Responsive frontend with React
- MongoDB database for user, post & message storage

---

## Tech Stack

**Frontend:**
- React.js
- Axios
- React Router DOM
- Context API / Redux (if used)
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Socket.IO
- Multer (for file uploads)

**Database:**
- MongoDB Atlas (or local MongoDB)

**Other Tools:**
- dotenv (for environment variables)
- CORS
- Helmet

---

## Installation & Setup

### 1. Clone the repository

### 2. Backend Setup

cd backend
npm install

--

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

--

npm run dev

### 3. Frontend Setup

cd frontend
npm install
npm start

