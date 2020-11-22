import { GraphQLDate } from 'graphql-iso-date';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SimpleTournament } from '../graphql/types/return/SimpleTournament';
import { Organization } from './Organization';
import { Profile } from './Profile';
import { Team } from './Team';

@ObjectType({ implements: [SimpleTournament, Profile] })
@Entity()
export class Tournament extends Profile implements SimpleTournament {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  tournamentName: string;

  @Field(() => GraphQLDate)
  @Column({ type: 'date' })
  dateStart: string;

  @Field(() => GraphQLDate, { nullable: true })
  @Column({ type: 'date', nullable: true })
  dateEnd: string;

  @Field(() => Boolean)
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
