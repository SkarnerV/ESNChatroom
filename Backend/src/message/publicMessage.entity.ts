import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PublicMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column()
  time!: string;

  @Column()
  sender!: string;

  @Column()
  senderStatus!: string;
}
