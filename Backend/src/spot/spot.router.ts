import express, { Request, Response, Router } from "express";
import SpotController from "./spot.controller";

export default class SpotRouter {
  private router: Router;
  private spotController: SpotController;

  constructor() {
    this.spotController = new SpotController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.registerGetSpotRoute();
    this.registerCreateSpotRoute();
    this.registerUpdateSpotRoute();
    this.registerDeleteSpotRoute();
  }

  private registerGetSpotRoute() {
    this.router.get("/",
      async (_: Request, response: Response) => {
        const spots = await this.spotController.getAllSpot();
        response.send(spots);
      });
  }

  private registerCreateSpotRoute() {
    this.router.post("/",
      async (req: Request, response: Response) => {
        const { info, latitude, longitude, username } = req.body;
        const spot = await this.spotController.createSpot(info, latitude, longitude, username);
        response.send(spot);  
      });
  }

  private registerUpdateSpotRoute() {
    this.router.put("/",
      async (request: Request, response: Response) => {
        const { id, info } = request.body;
        const spot = await this.spotController.updateSpot(id, info);
        response.send(spot);
      });
  }

  private registerDeleteSpotRoute() {
    this.router.delete("/",
      async (request: Request, response: Response) => {
        const { id } = request.body;
        const spot = await this.spotController.deleteSpot(id);
        response.send(spot);
      });
  }

  getRouter(): Router {
    return this.router;
  }
}