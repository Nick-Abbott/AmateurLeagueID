/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from './Admin';
import { TeamMember } from './TeamMember';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  discordId: string;

  @Field()
  @Column()
  username: string;

  @Field(() => [TeamMember])
  @OneToMany(() => TeamMember, team => team.user)
  memberships: TeamMember[];

  @Field(() => Admin, { nullable: true })
  @OneToOne(() => Admin, admin => admin.user, { nullable: true })
  admin: Admin;
}
