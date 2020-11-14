/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './Organization';
import { Team } from './Team';

@ObjectType()
@Entity()
export class Tournament extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  tournamentName: string;

  @Field()
  @Column({ type: 'date' })
  dateStart: string;

  @Field({ nullable: true })
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
