import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;      // <-- use ! instead of | undefined

  @Column()
  title!: string;

  @Column()
  duration!: string;

  @Column()
  type!: string;

  @Column()
  subtitle!: string;

  @Column()
  videoUrl!: string;
}