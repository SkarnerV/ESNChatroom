import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class FoodSharingSchedule {
  @PrimaryColumn()
  scheduleid!: string;

  @Column()
  scheduler!: string;

  @Column()
  schedulee!: string;

  @Column()
  time!: string;

  @Column()
  status!: string;
}
