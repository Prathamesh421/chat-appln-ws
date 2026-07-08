import { useEffect, useRef, useState } from "react";
import { useChatSocket } from "./hooks/useChatSocket";
import {toast} from "sonner"

interface ChatPayload {
  message: string;
  senderId: string;
}

function App() {
  const [messages, setMessages] = useState<ChatPayload[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const roomRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const myId = useRef(crypto.randomUUID());


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { send } = useChatSocket((msg) => {
    switch (msg.type) {
      case "chat":
        setMessages((prev) => [...prev, msg.payload]);
        break;
  
      case "system":
        toast(msg.payload.message);
        break;
  
      case "users":
        setUserCount(msg.payload.count);
        break;
    }
  })

  const joinRoom = () => {
    const roomId = roomRef.current?.value;
    if (!roomId?.trim()) return;
    setMessages([]);

    send({ type: "join", payload: { roomId } });
    setCurrentRoom(roomId);
  };

  const leaveRoom = () => {
    send({ type: "leave" });
    setCurrentRoom(null);
    setMessages([]);
    setUserCount(0);
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
      <div className="mb-4 flex justify-center">
        <div
          className={`flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-xl border shadow-lg
            ${currentRoom ? "bg-blue-400/20 border-blue-400/40" : "bg-white/25 border-white/40" }`}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full ${currentRoom ? "bg-green-600 animate-pulse" : "bg-gray-400"}`}
          />
          <span>
            {currentRoom ? `Connected to ${currentRoom} • ${userCount} users` : "Not in any room"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input ref={roomRef} placeholder="Enter room id..." className="flex-1 rounded-md border border-slate-300 bg-white/80 p-2 text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none hover:border-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") joinRoom();
          }}
        />

        <button onClick={joinRoom} className="bg-blue-400 text-white px-4 rounded cursor-pointer shadow-md transition-all duration-150 hover:bg-blue-500 active:scale-95 active:shadow-sm">
          Join
        </button>

        <button onClick={leaveRoom} className="bg-red-400 text-white px-4 rounded cursor-pointer shadow-md transition-all duration-150 hover:bg-red-500 active:scale-95 active:shadow-md">
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
            <div ref={bottomRef}></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          ref={inputRef}
          placeholder="Type message..."
          className="flex-1 p-2 rounded-md border border-slate-300 bg-white/80 text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none hover:border-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button disabled={!currentRoom} onClick={sendMessage} className="bg-blue-400 text-white px-4 rounded cursor-pointer shadow-md transition-all duration-150 hover:bg-blue-500 active:scale-95 active:shadow-sm">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;