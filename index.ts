import express, { Router } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";
import userDB from "./src/db/user";

class App {
  private app: express.Application;
  private server: any;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
  }

  private registerPortListener(): void {
    this.server.listen(3000, () => {
      console.log("listening on http://localhost:3000/");
    });
  }

  private registerHelloWorld(): void {
    this.app.get("/", (req, res) => {
      res.send("Hello World!!!");
    });
  }

  start(): void {
    let user = new userDB();
    user.createUser("user", "hiimauser");
    this.registerPortListener();
    this.registerHelloWorld();
  }
}

const application: App = new App();

application.start();
