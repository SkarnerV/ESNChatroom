import express, { Router, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";
import userDB from "./src/db/user";

class App {
  private app: express.Application;
  private server: any;
  private router: Router;
  private users: userDB;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.router = express.Router();
    this.users = new userDB();
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

    // Handles 
    this.app.post('/register', async (req: Request, res: Response) => {
        // Here password will need to add encryption
        const { username, password } = req.body;
        if(!username || !password) {
            res.status(400).json({message: "Username and Password are required"});
        }
        if(this.users.findUser(username.toLowerCase()) != null){
            res.status(400).json({message: "Username already exist"});
        }
        try {
            this.users.createUser(username.toLowerCase(), password);
            res.status(201).json({message: "User registered complete"});
        } catch (error){
            res.status(500).json({ message: 'Server error' });
        }
        
    });
  }

  start(): void {
    this.registerPortListener();
    this.reroute();
  }
}

const application: App = new App();

application.start();