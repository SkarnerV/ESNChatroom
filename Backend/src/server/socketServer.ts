import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Message } from "../message/message.entity";
import UserController from "../user/user.controller";

export class SocketServer {
  private static instance: SocketServer;
  private io: Server;
  private userController: UserController;
  constructor() {
    this.io = new Server();
    this.registerEventListerner();
    this.userController = new UserController();
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }

    return SocketServer.instance;
  }

  public attachHttpServer(httpServer: HttpServer): void {
    this.io.attach(httpServer);
  }

  private registerEventListerner(): void {
    this.io.on("connection", (socket: Socket) => {
      this.listenDisconnection(socket);
      this.listenStatusEvent(socket);
    });
  }

  private listenStatusEvent(socket: Socket): void {
    socket.on("last status", (lastStatus: string[]) => {
      this.io.emit("last status", lastStatus);
    });
  }

  private listenDisconnection(socket: Socket): void {
    const currentUser = socket.handshake.query.username as string;

    const onlineUsers = Array.from(this.io.sockets.sockets).map(
      ([, socket]) => socket.handshake.query.username
    );

    this.io.emit("online users", onlineUsers);

    socket.on("disconnect", () => {
      this.userController.updateUserStatus(currentUser);
      console.log(currentUser, "disconnected");
      const updatedOnlineUsers = Array.from(this.io.sockets.sockets).map(
        ([, socket]) => socket.handshake.query.username
      );
      this.io.emit("online users", updatedOnlineUsers);
    });
  }

  async broadcastMessage(sendee: string, message: Message): Promise<void> {
    if (sendee !== "Lobby" && sendee !== "Announcement" && !sendee.startsWith("Group") && sendee !== "Post") {
      this.io.emit("private message", message);
    }
    this.io.emit(sendee, message);
  }

  async broadcastDeleteMessage(
    messageId: number,
    message: Message
  ): Promise<void> {
    message.id = messageId;
    this.io.emit("delete post", message);
  }

  async broadcastChangedStatus(lastStatus: string[]): Promise<void> {
    this.io.emit("last status", lastStatus);
  }
}
