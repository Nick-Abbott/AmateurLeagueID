import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { SimpleTeam } from '../graphql/types/return/SimpleTeam';
import { Organization } from './Organization';
import { Profile } from './Profile';
import { TeamMember } from './TeamMember';
import { Tournament } from './Tournament';

@ObjectType({ implements: [SimpleTeam, Profile] })
@Entity()
export class Team extends Profile implements SimpleTeam {
  @Column()
  teamName: string;

  @Field(() => [TeamMember])
  @OneToMany(() => TeamMember, member => member.team, { onDelete: 'CASCADE' })
  members: TeamMember[];

  @Field(() => [Tournament])
  @ManyToMany(() => Tournament, tourney => tourney.teams)
  tournaments: Tournament[];

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, org => org.teams, { nullable: true })
  organization: Organization;
}
