import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.memberships, { nullable: false })
  user: User;

  @Field(() => Team)
  @ManyToOne(() => Team, team => team.members, { nullable: false })
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
