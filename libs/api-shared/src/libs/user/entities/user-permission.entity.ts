import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import {User} from "./user.entity";

@Entity('user_permission')
@Index(['userId'])
@Index(['permissionId'])
@Index(['userId', 'permissionId'], { unique: true })
export class UserPermission {
  @PrimaryColumn({ type: 'varchar', name: 'user_id' })
  userId: number;

  @PrimaryColumn({ type: 'int', unsigned: true, name: 'permission_id' })
  permissionId: number;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
