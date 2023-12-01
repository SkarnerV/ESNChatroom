import express, { NextFunction, Request, Response, Router } from "express";
import { createServer, Server as HttpServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./src/auth/auth.router";
import UserRouter from "./src/user/user.router";
import AuthDAO from "./src/auth/auth.dao";
import ESNDatabase from "./src/database/ESNDatabase";
import MessageRouter from "./src/message/message.router";
import SpeedTestRouter from "./src/speedtest/speedtest.router";
import SearchRouter from "./src/search/search.router";
import SpotRouter from "./src/spot/spot.router";
import WaitlistRouter from "./src/waitlist/waitlist.router";
import GroupRouter from "./src/group/group.router";
import ScheduleRouter from "./src/schedule/schedule.router";
import swaggerUI from "swagger-ui-express";
import * as swaggerDoc from "./public/swagger.json";
import { SocketServer } from "./src/server/socketServer";
import SpeedTestController from "./src/speedtest/speedtest.controller";
import { Exception } from "./src/util/exception";
import { CreateUserInput } from "./src/types/types";

class App {
  private app: express.Application;
  private server: HttpServer;
  private socket: SocketServer;
  private authDao: AuthDAO;

  constructor() {
    this.app = express();
    this.authDao = new AuthDAO();
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

  private registerErrorMiddleware(): void {
    this.app.use(
      (
        error: Exception,
        _: Request,
        response: Response,
        next: NextFunction
      ) => {
        const exception: Exception = error as Exception;
        response.status(exception.status).send(exception);

        next();
      }
    );
  }

  private registerTestMode(): void {
    this.app.use((req, res, next) => {
      if (
        SpeedTestController.getTestMode() &&
        !req.path.startsWith("/api/speedtests")
      ) {
        console.log("currenlty in testing mode");
        res
          .status(503)
          .send("System is in test mode. All requests are ignored.");
      } else {
        next();
      }
    });
  }

  private registerRoutes(): void {
    const authRouter: Router = new AuthRouter().getRouter();
    const userRouter: Router = new UserRouter().getRouter();
    const messageRouter: Router = new MessageRouter().getRouter();
    const testRouter: Router = new SpeedTestRouter().getRouter();
    const searchRouter: Router = new SearchRouter().getRouter();
    const spotRouter: Router = new SpotRouter().getRouter();
    const waitlistRouter: Router = new WaitlistRouter().getRouter();

    const scheduleRouter: Router = new ScheduleRouter().getRouter();
    const groupRouter: Router = new GroupRouter().getRouter();
    this.app.use("/api/groups", groupRouter);
    this.app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    this.app.use("/api/users", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/messages", messageRouter);
    this.app.use("/api/speedtests", testRouter);
    this.app.use("/api/search", searchRouter);
    this.app.use("/api/spots", spotRouter);
    this.app.use("/api/waitlist", waitlistRouter);
    this.app.use("/api/schedules", scheduleRouter);
  }

  private async registerDatabase(): Promise<void> {
    const database = ESNDatabase.getDatabaseInstance();
    await database.initializeDatabase();
  }

  private async registerCreateDefaultAdmin(): Promise<void> {
    const defaultAdmin: CreateUserInput = {
      username: "ESNAdmin",
      password: "admin",
    };
    this.authDao.createUser(defaultAdmin, true);
  }

  async start(): Promise<void> {
    await this.registerDatabase();

    this.registerCORS();
    this.registerTestMode();
    this.registerPortListener();
    this.registerBodyParser();
    this.registerRoutes();
    this.registerErrorMiddleware();
    this.registerCreateDefaultAdmin();
  }
}

const application: App = new App();

application.start();
