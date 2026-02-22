## 🌸 Instagram Clone (Backend)
A backend API for an Instagram-like social media application built using **Node.js, Express, MongoDB, and JWT Authentication**.
## 🚀 Features

* 🔐 User Registration
* 🔑 User Login with JWT Authentication
* 🍪 Secure Cookie-based Token Storage
* 🧂 Password Hashing using SHA256
* 🗄 MongoDB Database Integration
* ❌ Duplicate Email & Username Validation

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* Crypto (Password Hashing)
* Cookie-Parser
* dotenv

## 📂 Project Structure

```
Instagram-Clone/
│
├── server.js
├── .env
├── src/
│   ├── app.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── user.model.js
│   └── routes/
│       └── auth.routes.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/instagram-clone.git
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create .env file

```
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the server

```bash
npm run dev
```

Server will start at:

```
http://localhost:3000
```

## 📌 API Endpoints

### 🔐 Register User
POST /api/auth/register

### 🔑 Login User
POST /api/auth/login


## 🧠 Future Improvements

* 🖼 Upload posts
* ❤️ Like & Comment system
* 👥 Follow / Unfollow feature
* 🔎 Search users
* 📝 Edit profile
* 🔒 Protected routes middleware

-
## 👩‍💻 Author

Shreya
Aspiring AI Full Stack Developer 🚀

---

#
