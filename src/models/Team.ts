/* eslint-disable import/no-cycle */
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SimpleTeam } from '../graphql/types/return/SimpleTeam';
import { TeamMember } from './TeamMember';
import { Tournament } from './Tournament';

@ObjectType({ implements: SimpleTeam })
@Entity()
export class Team extends BaseEntity implements SimpleTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Field(() => [TeamMember])
  @OneToMany(() => TeamMember, member => member.team)
  members: TeamMember[];

  @Field(() => [Tournament])
  @ManyToMany(() => Tournament, tourney => tourney.teams)
  tournaments: Tournament[];
}
