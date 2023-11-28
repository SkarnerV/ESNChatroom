import { Repository } from "typeorm";
import { Likes } from "./likes.entity";
import ESNDatabase from "../database/ESNDatabase";
import { LikesMessageInput } from "../types/types";
import { Message } from "../message/message.entity";

export default class LikesDAO {
  private likesDatabase: Repository<Likes>;

  constructor() {
    this.likesDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(Likes);
  }

  async getAllLikes(): Promise<Likes[]> {
    const allLikes = await this.likesDatabase.find();
    return allLikes;
  }

  async createLike(
    likes: LikesMessageInput,
    LikedMessage: Message
  ): Promise<Likes> {
    const createdLikes = await this.likesDatabase.create();

    createdLikes.message = LikedMessage;
    createdLikes.username = likes.username;
    return await this.likesDatabase.save(createdLikes);
  }

  async deleteOneById(id: number): Promise<Likes[]> {
    const removeLike: Likes[] = await this.likesDatabase.findBy({
      id: id,
    });

    return await this.likesDatabase.remove(removeLike);
  }
}
