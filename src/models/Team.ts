/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamMember } from './TeamMember';
import { Tournament } from './Tournament';

@ObjectType()
@Entity()
export class Team extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [TeamMember])
  @OneToMany(() => TeamMember, member => member.team)
  members: TeamMember[];

  @Field(() => [Tournament])
  @ManyToMany(() => Tournament, tourney => tourney.teams)
  tournaments: Tournament[];
}
