import { User } from '../../users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity({ name: 'article' })
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  publicationDate: string;

  @OneToOne(() => User)
  @Column({ name: 'user_id' })
  userId: number;
}