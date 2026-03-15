import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/axios";

let socket: Socket | null = null;

export function getOrderSocket(): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  const base = API_BASE_URL.replace(/\/$/, "");
  socket = io(`${base}/orders`, {
    transports: ["websocket"],
  });

  return socket;
}

