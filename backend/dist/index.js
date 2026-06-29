import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message", (raw) => {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "chat") {
            const payload = {
                message: msg.payload.message,
                senderId: msg.payload.senderId,
            };
            // broadcast to everyone
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(payload));
                }
            });
        }
    });
    socket.on("close", () => {
        console.log("Client disconnected");
    });
});
console.log("WebSocket running on ws://localhost:8080");
//# sourceMappingURL=index.js.map