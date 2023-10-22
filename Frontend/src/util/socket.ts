import io, { Socket } from "socket.io-client";
import jwt from "jsonwebtoken";
import { endpoint } from "../api/routes";

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

export const socket: Socket = io(endpoint, {
  transports: ["websocket"],
  query: {
    username: currentUser ? currentUser.username : "",
  },
});
