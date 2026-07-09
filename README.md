# 💬 Real-Time Chat Application

A lightweight real-time chat application built using **React**, **TypeScript**, **Node.js**, and **WebSockets**. Users can create or join chat rooms, exchange messages instantly, and see live participant counts.

## Demo:
Link: https://drive.google.com/file/d/15jD2alfBldNZ5I8w28QvxVXYCgvRFbcz/view?usp=sharing

## Features

-  Real-time communication using WebSockets
-  Join any chat room using a Room ID
-  Leave rooms anytime
-  Live user count updates, Join/Leave system notifications
-  Instant message broadcasting
-  Custom React hook for WebSocket management

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- TypeScript
- ws (WebSocket library)

## Project Structure

```
chat-appln-ws/
│
├── frontend/
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useChatSocket.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

##  How It Works

1. The backend starts a WebSocket server on **port 8080**.
2. A user joins a room by sending a `join` event.
3. The server stores room information using in-memory Maps.
4. Chat messages are broadcast only to users in the same room.
5. User count updates are sent whenever someone joins or leaves.

##  Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd chat-appln-ws
```

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The WebSocket server runs at:

```
ws://localhost:8080
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Open:

```
http://localhost:5173
```

## Implementation Details

The backend maintains two in-memory data structures:

- **rooms** → Maps each room ID to its connected clients.
- **socketRoom** → Maps each WebSocket connection to its current room.

This allows:

- Efficient room lookup
- Broadcasting only to room participants
- Tracking connected users
- Automatic room cleanup when empty

## Current Limitations

- No authentication
- No database or message persistence
- Single WebSocket server instance
- Messages disappear after server restart

## Future Improvements

- User authentication
- Persistent chat history
- Online/offline status
- Multiple chat rooms list
- Deployment with HTTPS/WSS
- Redis Pub/Sub for scaling
