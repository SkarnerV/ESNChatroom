import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  lastTimeUpdateStatus!: Date;

  @Column()
  lastOnlineTime!: string;

  @Column()
  role!: string;

  @Column()
  isActivated!: boolean;
}
