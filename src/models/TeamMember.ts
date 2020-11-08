/* eslint-disable import/no-cycle */
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { Team } from './Team';
import { User } from './User';

export enum TeamMemberRole {
  HEAD_COACH = 'HEAD_COACH',
  ASSISTANT_COACH = 'ASSISTANT_COACH',
  PLAYER = 'PLAYER',
  SUBSTITUTE = 'SUBSTITUTE',
}

registerEnumType(TeamMemberRole, { name: 'TeamMemberRole' });

@ObjectType()
@Entity()
export class TeamMember extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, user => user.memberships, { primary: true })
  user: User;

  @Field(() => Team)
  @ManyToOne(() => Team, team => team.members)
  team: Team;

  @Field(() => TeamMemberRole)
  @Column({
    type: 'enum',
    enum: TeamMemberRole,
    default: TeamMemberRole.PLAYER,
  })
  role: TeamMemberRole;

  @Field()
  @Column({ default: true })
  active: boolean;
}
