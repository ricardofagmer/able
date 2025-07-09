import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { PermissaoEndpoint } from './permission-endpoint.entity';

@Entity('endpoint')
@Unique(['name'])
@Unique(['value'])
export class EndpointWeb {

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 254 })
  name: string;

  @Column({ type: 'varchar', length: 254 })
  value: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deactivatedAt: Date | null;

  @OneToMany(() => PermissaoEndpoint, permissaoEndpoint => permissaoEndpoint.endpoint)
  permissaoEndpoints: PermissaoEndpoint[];
}
