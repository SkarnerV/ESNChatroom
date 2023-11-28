import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../message/message.entity";

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Message, (message) => message.likes, {
    onDelete: "CASCADE",
  })
  message!: Message;

  @Column()
  username!: string;
}
