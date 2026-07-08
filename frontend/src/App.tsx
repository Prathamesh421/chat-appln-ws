import { useRef, useState } from "react";
import { useChatSocket } from "./hooks/useChatSocket";

interface ChatPayload {
  message: string;
  senderId: string;
}

function App() {
  const [messages, setMessages] = useState<ChatPayload[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const roomRef = useRef<HTMLInputElement | null>(null);
  const myId = useRef(crypto.randomUUID());

  const { send } = useChatSocket((msg) => {
    setMessages((prev) => [...prev, msg]);
  })

  const joinRoom = () => {
    const roomId = roomRef.current?.value;
    if (!roomId?.trim()) return;

    send({ type: "join", payload: { roomId } });
    setCurrentRoom(roomId);
  };

  const leaveRoom = () => {
    send({ type: "leave" });
    setCurrentRoom(null);
  };

  const sendMessage = () => {
    const message = inputRef.current?.value;
    if (!message?.trim()) return;

    send({
      type: "chat",
      payload: {
        message,
        senderId: myId.current,
        },
      });

    inputRef.current!.value = "";
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-slate-300">
      <div className="mb-3 text-sm text-gray-700">
        {currentRoom ? (
          <span>
            Connected to room:{" "}
            <span className="font-semibold text-black">
              {currentRoom}
            </span>
          </span>
        ) : (
          <span className="text-gray-500">Not in any room</span>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          ref={roomRef}
          placeholder="Enter room id..."
          className="border p-2 flex-1 rounded"
        />

        <button onClick={joinRoom} className="bg-blue-400 text-white px-4 rounded">
          Join
        </button>

        <button onClick={leaveRoom} className="bg-red-400 text-white px-4 rounded">
          Leave
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.senderId === myId.current
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded max-w-xs ${
                msg.senderId === myId.current
                  ? "bg-blue-400 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          ref={inputRef}
          placeholder="Type message..."
          className="border p-2 flex-1 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage} className="bg-blue-400 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;