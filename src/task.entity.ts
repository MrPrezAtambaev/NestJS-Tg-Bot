import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Todo' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column()
  completed: boolean;
}
