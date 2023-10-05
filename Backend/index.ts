import express, { Router } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./src/auth/auth.router";
import UserRouter from "./src/user/user.router";
import ESNDatabase from "./src/database/ESNDatabase";
import MessageRouter from "./src/message/message.router";

import swaggerUI from "swagger-ui-express";
import * as swaggerDoc from "./public/swagger.json";

class App {
  private app: express.Application;
  private server: HttpServer;
  private io: Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server);
  }

  private registerMessageListener(): void {
    this.io.on("connection", (socket: Socket) => {
      const currentUser = socket.handshake.query.username;
      console.log(currentUser, "connected");

      const onlineUsers = Array.from(this.io.sockets.sockets).map(
        ([, socket]) => socket.handshake.query.username
      );
      console.log("current users:", onlineUsers);
      this.io.emit("online users", onlineUsers);

      socket.on("disconnect", () => {
        console.log(currentUser, "disconnected");
        const updatedOnlineUsers = Array.from(this.io.sockets.sockets).map(
          ([, socket]) => socket.handshake.query.username
        );
        console.log("current users:", updatedOnlineUsers);
        this.io.emit("online users", updatedOnlineUsers);
      });

      socket.on("chat message", (message: string) => {
        this.io.emit("chat message", message);
      });
    });
  }

  private registerCORS(): void {
    this.app.use(cors());
  }

  private registerPortListener(): void {
    this.server.listen(3000, () => {
      console.log("listening on http://localhost:3000/");
    });
  }

  private registerBodyParser(): void {
    this.app.use(bodyParser.json());
  }

  private registerRoutes(): void {
    const authRouter: Router = new AuthRouter().getRouter();
    this.app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    const userRouter: Router = new UserRouter().getRouter();
    const messageRouter: Router = new MessageRouter().getRouter();
    this.app.use("/users", authRouter);
    this.app.use("/users", userRouter);
    this.app.use("/messages", messageRouter);
  }

  private async registerDatabase(): Promise<void> {
    const database = ESNDatabase.getDatabaseInstance();

    await database.initializeDatabase();
  }

  async start(): Promise<void> {
    await this.registerDatabase();
    this.registerCORS();
    this.registerMessageListener();
    this.registerPortListener();
    this.registerBodyParser();
    this.registerRoutes();
  }
}

const application: App = new App();

application.start();
