/* eslint-disable import/no-cycle */
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SimpleUser } from '../graphql/types/return/SimpleUser';
import { Admin } from './Admin';
import { TeamMember } from './TeamMember';

@ObjectType({ implements: [SimpleUser] })
@Entity()
export class User extends BaseEntity implements SimpleUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  discordId: string;

  @Column()
  username: string;

  @Field(() => [TeamMember])
  @OneToMany(() => TeamMember, team => team.user)
  memberships: TeamMember[];

  @Field(() => Admin, { nullable: true })
  @OneToOne(() => Admin, admin => admin.user, { nullable: true })
  admin: Admin;
}
