import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Spot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column("text")
  info!: string; 

  @Column("double")
  latitude!: number;

  @Column("double")
  longitude!: number;

  @Column()
  lastUpdateTime!: string;

}
