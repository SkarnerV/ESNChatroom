import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WaitlistUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  foodComments!: string;

  @Column()
  waitlistStatus!: string;

  @Column()
  foodDonor!: string;

  @Column()
  joinTime!: string;
}
