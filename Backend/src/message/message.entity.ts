import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}