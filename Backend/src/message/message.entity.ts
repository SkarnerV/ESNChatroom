import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Likes } from "../likes/likes.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column()
  time!: string;

  @Column()
  sender!: string;

  @Column()
  sendee!: string;

  @Column()
  senderStatus!: string;

  @OneToMany(() => Likes, (likes) => likes.message, {
    eager: true,
  })
  likes?: Likes[];
}
