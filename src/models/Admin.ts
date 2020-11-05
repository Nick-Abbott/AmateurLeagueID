/* eslint-disable import/no-cycle */
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Organization } from './Organization';
import { User } from './User';

@ObjectType()
@Entity()
export class Admin extends BaseEntity {
  @OneToOne(() => User, user => user.admin, { primary: true })
  @JoinColumn()
  user: User;

  @Field(() => Organization)
  @ManyToOne(() => Organization, org => org.admins)
  organization: Organization;
}
