import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Message {
  message: string;
  senderId: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const myId = useRef(crypto.randomUUID());

  useEffect(() => {
    // ✅ FIXED: ws:// NOT http://
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (err) => {
      console.log("WebSocket error:", err);
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value;
    if (!message?.trim()) return;

    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message,
          senderId: myId.current,
        },
      })
    );

    inputRef.current!.value = "";
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-slate-200">
      {/* MESSAGES */}
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
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-4">
        <input
          ref={inputRef}
          placeholder="Type message..."
          className="border p-2 flex-1 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;