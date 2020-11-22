import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { SimpleOrganization } from '../graphql/types/return/SimpleOrganization';
import { Admin } from './Admin';
import { Profile } from './Profile';
import { Team } from './Team';
import { Tournament } from './Tournament';

@ObjectType({ implements: [SimpleOrganization, Profile] })
@Entity()
export class Organization extends Profile implements SimpleOrganization {
  @Column({ unique: true })
  orgName: string;

  @OneToMany(() => Admin, admin => admin.organization, { onDelete: 'CASCADE' })
  admins: Admin[];

  @Field(() => [Tournament])
  @OneToMany(() => Tournament, tournament => tournament.organization)
  tournaments: Tournament[];

  @Field(() => [Team])
  @OneToMany(() => Team, team => team.organization)
  teams: Team[];
}
