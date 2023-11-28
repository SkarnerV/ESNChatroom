import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;
}

export { Group };
