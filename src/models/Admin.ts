/* eslint-disable import/no-cycle */
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './Organization';
import { User } from './User';

@ObjectType()
@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.admin, { nullable: false })
  @JoinColumn()
  user: User;

  @Field(() => Organization)
  @ManyToOne(() => Organization, org => org.admins)
  organization: Organization;
}
