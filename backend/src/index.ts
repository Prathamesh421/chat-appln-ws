import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Set<WebSocket>>();
const socketRoom = new Map<WebSocket, string>();

type JoinMessage = {
  type: "join";
  payload: {
    roomId: string;
  };
};

type ChatMessage = {
  type: "chat";
  payload: {
    message: string;
    senderId: string;
  };
};

type LeaveMessage = {
  type: "leave";
};

type SystemMessage = {
  type: "system";
  payload: {
    message: string;
  };
};

type UsersMessage = {
  type: "users";
  payload: {
    count: number;
  };
};

type ClientMessage = JoinMessage | ChatMessage | LeaveMessage;

function handleJoin(socket: WebSocket, msg: JoinMessage) {
  const roomId = msg.payload.roomId;

  if (!roomId) return;
  leaveRoom(socket);
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId)!.add(socket);
  socketRoom.set(socket, roomId);
  broadcastRoom(roomId, {
    type: "system",
    payload: {
      message: "A user joined the room",
    },
  },
    socket,
  );
  
  broadcastRoom(roomId, {
    type: "users",
    payload: {
      count: rooms.get(roomId)!.size,
    },
  });
  console.log(`Client joined room ${roomId}`);
}

function handleChat(socket: WebSocket, msg: ChatMessage) {
  const roomId = socketRoom.get(socket);

  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;

  const payload = {
    type: "chat",
    payload: {
      senderId: msg.payload.senderId,
      message: msg.payload.message,
    },
  };

  room.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

function leaveRoom(socket: WebSocket) {
  const roomId = socketRoom.get(socket);
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(socket);
  broadcastRoom(roomId, {
    type: "system",
    payload: {
      message: "A user left the room",
    },
  });

  broadcastRoom(roomId, {
    type: "users",
    payload: {
      count: room.size,
    },
  });

  if (room.size === 0) {
    rooms.delete(roomId);
  }

  socketRoom.delete(socket);
}

function broadcastRoom(roomId: string, data: SystemMessage | UsersMessage, exclude?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach((client) => {
    if (client !== exclude &&  client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (raw) => {
    let msg: ClientMessage; 
    try {
      msg = JSON.parse(raw.toString());
    } catch (error) {
      return error;
    }

    if (msg.type == "join") {
      handleJoin(socket, msg);
    } else if (msg.type === "chat") {
      handleChat(socket, msg);
    } else if (msg.type === "leave") {
      leaveRoom(socket);
    }
  });

  socket.on("close", () => {
    leaveRoom(socket);
    console.log("Client disconnected");
    });
});

console.log("WebSocket running on ws://localhost:8080");