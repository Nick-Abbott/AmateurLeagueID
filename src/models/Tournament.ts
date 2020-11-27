import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { SimpleTournament } from '../graphql/types/return/SimpleTournament';
import { Organization } from './Organization';
import { Profile } from './Profile';
import { Team } from './Team';

@ObjectType({ implements: [SimpleTournament, Profile] })
@Entity()
export class Tournament extends Profile implements SimpleTournament {
  @Column({ unique: true })
  tournamentName: string;

  @Column({ type: 'date' })
  dateStart: string;

  @Column({ type: 'date', nullable: true })
  dateEnd: string;

  get active() {
    return this.dateEnd === null || new Date() < new Date(this.dateEnd);
  }

  @Field(() => Organization)
  @ManyToOne(() => Organization, org => org.tournaments, { nullable: false })
  organization: Organization;

  @Field(() => [Team])
  @ManyToMany(() => Team, team => team.tournaments)
  @JoinTable()
  teams: Team[];
}
