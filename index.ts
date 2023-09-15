import express, { Router, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";
import userRouter from "./src/userRouter";

class App {
  private app: express.Application;
  private server: any;
  private router: userRouter;


  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.router = new userRouter();
  }

  private registerPortListener(): void {
    this.app.use(bodyParser.json());
    this.server.listen(3000, () => {
      console.log("listening on http://localhost:3000/");
    });
  }

  private reroute(): void {
    this.app.use(express.static(__dirname + '/public'));
    this.app.get("/");
    
    // Handles register action
    this.app.post('/auth/register', this.router.register);

  }

  start(): void {
    this.registerPortListener();
    this.reroute();
  }
}

const application: App = new App();

application.start();