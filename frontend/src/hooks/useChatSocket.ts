import { useEffect, useRef } from "react";

interface ChatPayload {
  message: string;
  senderId: string;
}

type ServerMessage = {
  type: "chat";
  payload: ChatPayload;
};

export function useChatSocket(onMessage: (msg: ChatPayload) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);

      if (msg.type === "chat") {
        onMessageRef.current(msg.payload);
      }
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  const send = (data: any) => {
    wsRef.current?.send(JSON.stringify(data));
  };

  return { send };
}