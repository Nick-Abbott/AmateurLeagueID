/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from './Admin';
import { Tournament } from './Tournament';

@ObjectType()
@Entity()
export class Organization extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  orgName: string;

  @OneToMany(() => Admin, admin => admin.organization)
  admins: Admin[];

  @Field(() => [Tournament])
  @OneToMany(() => Tournament, tournament => tournament.organization)
  tournaments: Tournament[];
}
