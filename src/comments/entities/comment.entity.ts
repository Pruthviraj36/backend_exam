import { User } from 'src/users/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OldStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticket_id: number;

  @Column({
    type: 'enum',
    enum: OldStatus,
  })
  old_status: OldStatus;

  @Column({
    type: 'enum',
    enum: OldStatus,
  })
  new_status = OldStatus;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id' })
  changed_by: User;

  @Column()
  changed_at: string;

  @BeforeUpdate()
  updateTimeStamp() {
    this.changed_at = new Date().toDateString();
  }
}
//     id int PRIMARY KEY AUTO_INCREMENT,
// 	   ticket_id int,
//     foreign key(ticket_id) references tickets(id) on delete cascade,
//     old_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL,
//     new_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL,
//     changed_by int,
//     foreign key(changed_by) references users(id),
//     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
