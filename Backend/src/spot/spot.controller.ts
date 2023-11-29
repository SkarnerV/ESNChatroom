import SpotDAO from "./spot.dao";

export default class SpotController {
  private SpotDAO: SpotDAO;

  constructor() {
    this.SpotDAO = new SpotDAO();
  }

  async getAllSpot() {
    return await this.SpotDAO.getAllSpot();
  }

  async createSpot(info: string, latitude: number, longitude: number, username: string) {
    return await this.SpotDAO.createSpot(info, latitude, longitude, username);
  }

  async updateSpot(id: number,info: string) {
    return await this.SpotDAO.updateSpot(id, info);
  }

  async deleteSpot(id: number) {
    return await this.SpotDAO.deleteSpot(id);
  }
  
}