import express, { Router } from "express";
import { createServer, Server as HttpServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./src/auth/auth.router";
import UserRouter from "./src/user/user.router";
import ESNDatabase from "./src/database/ESNDatabase";
import MessageRouter from "./src/message/message.router";
import swaggerUI from "swagger-ui-express";
import * as swaggerDoc from "./public/swagger.json";
import { SocketServer } from "./src/server/socketServer";

class App {
  private app: express.Application;
  private server: HttpServer;
  private socket: SocketServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socket = SocketServer.getInstance();
    this.socket.attachHttpServer(this.server);
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
    this.app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    const userRouter: Router = new UserRouter().getRouter();
    const messageRouter: Router = new MessageRouter().getRouter();
    this.app.use("/api/users", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/messages", messageRouter);
  }

  private async registerDatabase(): Promise<void> {
    const database = ESNDatabase.getDatabaseInstance();

    await database.initializeDatabase();
  }

  async start(): Promise<void> {
    await this.registerDatabase();
    this.registerCORS();
    this.registerPortListener();
    this.registerBodyParser();
    this.registerRoutes();
  }
}

const application: App = new App();

application.start();
