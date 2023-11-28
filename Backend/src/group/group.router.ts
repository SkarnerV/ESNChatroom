import express, { Request, Response, Router } from "express";
import GroupController from "./group.controller";

export default class GroupRouter {
  private router: Router;
  private groupController: GroupController;

  constructor() {
    this.groupController = new GroupController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.registerGetAllGroupsRoute();
    this.registerCreateGroupRoute();
    this.registerUpdateGroupRoute();
    this.registerDeleteGroupRoute();
  }

  private registerGetAllGroupsRoute() {
    this.router.get("/", async (_: Request, response: Response) => {
      const groups = await this.groupController.getAllGroups();
      response.json(groups);
    });
  }

  private registerCreateGroupRoute() {
    this.router.post("/", async (req: Request, response: Response) => {
      const { name, description } = req.body;
      const group = await this.groupController.createGroup(name, description);
      response.status(201).json(group);
    });
  }

  private registerUpdateGroupRoute() {
    this.router.put("/", async (req: Request, response: Response) => {
      const curName = req.body.curname;
      const newName = req.body.name;
      const newDescription = req.body.description;
      const group = await this.groupController.updateGroup(
        curName,
        newName,
        newDescription
      );
      response.json(group);
    });
  }

  private registerDeleteGroupRoute() {
    this.router.delete("/", async (req: Request, response: Response) => {
      const name = req.body.name;
      const group = await this.groupController.deleteGroup(name);
      response.json(group);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
