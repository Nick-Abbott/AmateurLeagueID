/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from './Admin';
import { Tournament } from './Tournament';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  discordId: string;

  @Field()
  @Column()
  username: string;

  @Field(() => [Tournament])
  @ManyToMany(() => Tournament, tourney => tourney.players)
  tournamentHistory: Tournament[];

  @Field(() => Admin, { nullable: true })
  @OneToOne(() => Admin, admin => admin.user)
  admin: Admin;
}
