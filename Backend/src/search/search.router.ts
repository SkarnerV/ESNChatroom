import express, { Router, Response, Request } from "express";
import SearchController from "./search.controller";

export default class SearchRouter {
  private router: Router;
  private searchController: SearchController;

  constructor() {
    this.searchController = new SearchController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.router.get(
      "/:context",
      async (request: Request, response: Response) => {
        const searchResult = await this.searchController.searchInformation(
          request.params.context,
          request.query.criteria as string,
          request.query.sender as string,
          request.query.sendee as string
        );
        response.send(searchResult);
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
