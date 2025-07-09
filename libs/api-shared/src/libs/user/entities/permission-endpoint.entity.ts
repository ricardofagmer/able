import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Permission } from './permission.entity';
import { EndpointWeb } from './endpoint.entity';

@Entity('permissao_endpoint')
@Index(['permissaoId'])
@Index(['endpointId'])
@Index(['permissaoId', 'endpointId'], { unique: true })
export class PermissaoEndpoint {
  @PrimaryColumn({ type: 'int', unsigned: true, name: 'permissao_id' })
  permissaoId: number;

  @PrimaryColumn({ type: 'int', unsigned: true, name: 'endpoint_id' })
  endpointId: number;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'permissao_id' })
  permission: Permission;

  @ManyToOne(() => EndpointWeb, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'endpoint_id' })
  endpoint: EndpointWeb;
}
