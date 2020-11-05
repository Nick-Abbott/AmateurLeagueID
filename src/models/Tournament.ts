/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './Organization';
import { User } from './User';

@ObjectType()
@Entity()
export class Tournament extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  tournamentName: string;

  @Field(() => Organization)
  @ManyToOne(() => Organization, org => org.tournaments)
  organization: Organization;

  @Field(() => [User])
  @ManyToMany(() => User, user => user.tournamentHistory)
  @JoinTable()
  players: User[];
}
