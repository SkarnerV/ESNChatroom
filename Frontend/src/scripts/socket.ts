import io, { Socket } from "socket.io-client";
import { endpoint } from "../api/routes";

export const socket: Socket = io(endpoint, {
    transports: ["websocket"]
});