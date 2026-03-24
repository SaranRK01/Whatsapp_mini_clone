# WhatsApp Web Clone

A full-stack WhatsApp Web clone featuring a React frontend (Vite, Tailwind CSS, Zustand) and a Node.js backend (Express, MongoDB, Socket.IO) with real-time messaging capabilities.

## 🚀 Features

- **Real-time Messaging:** Powered by Socket.IO for instant communication.
- **Authentication:** Secure JWT-based login and registration with bcrypt password hashing.
- **Online Status & Typing Indicators:** See when users are online and when they are typing.
- **Read Receipts:** Messages are marked as read when the recipient opens the chat.
- **Modern UI:** Pixel-perfect dark theme WhatsApp UI built with Tailwind CSS.
- **Responsive & Fast:** Built with Vite and React.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v16 or higher)
- **MongoDB** (running locally on default port `27017`)

---

## 💻 How to Start the Project

The project is split into two folders: `backend` and `whatsapp_web` (frontend). You will need to start both of them in separate terminal windows.

### 1. Start the Backend

Open your first terminal and run the following commands:

```bash
cd backend
npm install
npm run dev
```

You should see logs indicating that the MongoDB is connected and the API/Socket.IO server is running on `http://localhost:5000`.

### 2. Start the Frontend

Open a **second** terminal and run the following commands:

```bash
cd whatsapp_web
npm install
npm run dev
```

The React app will start on `http://localhost:5173` (or `5174`). Open that URL in your browser.

---

## 💬 How to Chat (Testing Real-time Messaging)

To test the real-time chat, you need at least two interacting users. Follow these steps:

1. **Open your browser** and go to the frontend URL (e.g., `http://localhost:5173`).
2. **Register User 1:** Click on "Register here" and create your first account (e.g., Username: `Alice`, Password: `password123`).
3. **Open a new window:** Open an **Incognito/Private window** (or a different browser entirely) and go to the exact same URL.
4. **Register User 2:** In the new window, create a second account (e.g., Username: `Bob`, Password: `password123`).
5. **Start a Chat:** 
   - In Alice's window, click the **New Chat button** (the chat bubble icon near the top left, next to the logout button) or simply type `Bob` in the search bar.
   - Click on Bob's name to open the chat window.
6. **Send a Message:** Type a message and hit Send! You will instantly see the typing indicator and the message appear in Bob's window.

Enjoy chatting!
