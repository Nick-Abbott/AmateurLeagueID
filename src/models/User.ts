import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SimpleUser } from '../graphql/types/return/SimpleUser';
import { Admin } from './Admin';
import { Profile } from './Profile';
import { TeamMember } from './TeamMember';

@ObjectType({ implements: [SimpleUser, Profile] })
@Entity()
export class User extends Profile implements SimpleUser {
  @Column({ unique: true })
  discordId: string;

  @Column()
  username: string;

  @Field(() => [TeamMember])
  @OneToMany(() => TeamMember, team => team.user, { onDelete: 'CASCADE' })
  memberships: TeamMember[];

  @Field(() => Admin, { nullable: true })
  @OneToOne(() => Admin, admin => admin.user, { nullable: true, onDelete: 'CASCADE' })
  admin: Admin;
}
