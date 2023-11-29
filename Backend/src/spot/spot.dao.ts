import { Repository } from "typeorm";
import ESNDatabase from "../database/ESNDatabase";
import { Spot } from "./spot.entity";

export default class SpotDAO {
  private ESNSpotDatabase: Repository<Spot>;

  constructor() {
    this.ESNSpotDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(Spot);
  }

  async getAllSpot() {
    return await this.ESNSpotDatabase.find({
      select: ["id", "info", "latitude", "longitude", "username", "lastUpdateTime"],
    });
  }

  async createSpot(info: string, latitude: number, longitude: number, username: string) {
    const spot = new Spot();
    spot.info = info;
    spot.latitude = latitude;
    spot.longitude = longitude;
    spot.username = username;
    spot.lastUpdateTime = new Date().toISOString();
    return await this.ESNSpotDatabase.save(spot);
  }

  async updateSpot(id: number, info: string) {
    const spot = await this.ESNSpotDatabase.findOne({
      where: { id },
    });
    if (!spot) {
      return null;
    }
    spot.info = info;
    spot.lastUpdateTime = new Date().toISOString();
    return await this.ESNSpotDatabase.save(spot);
  }

  async deleteSpot(id: number) {
    const spot = await this.ESNSpotDatabase.findOne({
      where: { id },
    });
    if (!spot) {
      return null;
    }
    return await this.ESNSpotDatabase.remove(spot);
  }
}