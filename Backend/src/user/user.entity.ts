import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ESNUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  lastStatus!: string;

  @Column()
  isOnline: boolean = false;

  @Column()
  lastTimeUpdateStatus!: Date;

  @Column()
  lastOnlineTime!: string;
}
