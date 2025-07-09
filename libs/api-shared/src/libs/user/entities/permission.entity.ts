import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { PermissaoEndpoint } from './permission-endpoint.entity';
import { UserPermission } from './user-permission.entity';

@Entity('permission')
@Unique(['name'])
export class Permission {

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 254 })
  name: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deactivatedAt: Date | null;

  @OneToMany(() => PermissaoEndpoint, permissaoEndpoint => permissaoEndpoint.permission)
  permissaoEndpoints: PermissaoEndpoint[];

  @OneToMany(() => UserPermission, userPermission => userPermission.permission)
  userPermissions: UserPermission[];
}
