/* eslint-disable import/no-cycle */
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SimpleOrganization } from '../graphql/types/return/SimpleOrganization';
import { Admin } from './Admin';
import { Tournament } from './Tournament';

@ObjectType({ implements: SimpleOrganization })
@Entity()
export class Organization extends BaseEntity implements SimpleOrganization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orgName: string;

  @OneToMany(() => Admin, admin => admin.organization)
  admins: Admin[];

  @Field(() => [Tournament])
  @OneToMany(() => Tournament, tournament => tournament.organization)
  tournaments: Tournament[];
}
