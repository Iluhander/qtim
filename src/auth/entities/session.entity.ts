
import { User } from '../../users/entities/users.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session' })
export class Session {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User)
  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  refresh_token: string;
}
