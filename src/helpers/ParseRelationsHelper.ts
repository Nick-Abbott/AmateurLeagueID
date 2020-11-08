import { GraphQLResolveInfo, SelectionNode } from 'graphql';
import { BaseEntity } from 'typeorm';
import { Admin } from '../models/Admin';
import { Organization } from '../models/Organization';
import { Team } from '../models/Team';
import { TeamMember } from '../models/TeamMember';
import { Tournament } from '../models/Tournament';
import { User } from '../models/User';

type SelectionType = {
  name: string;
  set: SelectionNode[];
};

type TMapping<T extends BaseEntity> = { [key in keyof T]?: keyof TMappings };
export type TMappings = {
  user: TMapping<User>,
  admin: TMapping<Admin>,
  tournament: TMapping<Tournament>,
  organization: TMapping<Organization>,
  team: TMapping<Team>,
  teamMember: TMapping<TeamMember>,
};

const mappings: TMappings = {
  user: {
    memberships: 'teamMember',
    admin: 'admin',
  },
  admin: {
    organization: 'organization',
  },
  tournament: {
    organization: 'organization',
    teams: 'team',
  },
  organization: {
    tournaments: 'tournament',
  },
  team: {
    tournaments: 'tournament',
  },
  teamMember: {
    team: 'team',
  },
};

const mapSelectionNodesToSelectionTypes = (node: SelectionNode[]) => node
  .map<SelectionType>((obj: any) => ({ name: obj.name.value, set: obj.selectionSet?.selections }));

type TParse = (args: SelectionType[], mapping: TMapping<any>) => string[];
const parse: TParse = (args: SelectionType[], mapping: TMapping<any>) => {
  const keys = Object.keys(mapping);
  const filter = args.filter(({ name }) => keys.includes(name));
  const reduced = filter
    .reduce(
      (acc, arg) => ([
        ...acc,
        ...parse(mapSelectionNodesToSelectionTypes(arg.set), mappings[mapping[arg.name] as keyof TMappings]).map(key => `${arg.name}.${key}`),
      ]),
      [] as string[],
    );
  return [...filter.map(key => key.name), ...reduced];
};

export const getRelations = (info: GraphQLResolveInfo, funcName: string, mapping: keyof TMappings) => {
  const selectionSet: SelectionNode[] = (<any>info.operation.selectionSet.selections)
    .find((obj: any) => obj.name.value === funcName).selectionSet.selections;
  const selections = selectionSet
    .map<SelectionType>((obj: any) => ({ name: obj.name.value, set: obj.selectionSet?.selections }));
  return parse(selections, mappings[mapping]);
};
