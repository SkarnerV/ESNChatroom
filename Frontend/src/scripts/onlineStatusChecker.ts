import jwt from "jsonwebtoken";
import { socket } from "./socket";
import { updateOnlineStatus } from "../api/user";

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

if (currentUser) {
    updateOnlineStatus(currentUser.username, "true");
    socket.emit("online", currentUser.username);
}

window.addEventListener('beforeunload', async(event) => {
    event.preventDefault();
    updateOnlineStatus(currentUser.username, "false");
    socket.emit("offline", currentUser.username);
    window.close();
});