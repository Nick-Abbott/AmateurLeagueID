import { GraphQLResolveInfo, SelectionNode } from 'graphql';

type SelectionType = {
  name: string;
  set: SelectionNode[];
};

type ParseFunc = (args: SelectionType[]) => string[];

const mapSelectionNodesToSelectionTypes = (node: SelectionNode[]) => node
  .map<SelectionType>((obj: any) => ({ name: obj.name.value, set: obj.selectionSet?.selections }));

const tourneyKeyFromUser = 'tournamentHistory';
const userKey = 'players';
const orgKey = 'organization';
const tourneyKeyFromOrg = 'tournaments';

export const parsers = {
  parseUserRelations: (args: SelectionType[]) => {
    const tourney = args.find(arg => arg.name === tourneyKeyFromUser);
    if (tourney) {
      return [
        tourneyKeyFromUser,
        ...parsers.parseTourneyRelations(mapSelectionNodesToSelectionTypes(tourney.set))
          .map(key => `${tourneyKeyFromUser}.${key}`),
      ];
    }
    return [];
  },
  parseTourneyRelations: (args: SelectionType[]) => {
    const filter = args.filter(({ name }) => name === userKey || name === orgKey);
    const results: string[] = filter
      .reduce(
        (acc, arg) => {
          if (arg.name === userKey) {
            return [...acc, ...parsers.parseUserRelations(mapSelectionNodesToSelectionTypes(arg.set)).map(key => `${userKey}.${key}`)];
          }
          if (arg.name === orgKey) {
            return [...acc, ...parsers.parseOrgRelations(mapSelectionNodesToSelectionTypes(arg.set)).map(key => `${orgKey}.${key}`)];
          }
          return acc;
        },
        [] as string[],
      );
    if (filter.length) {
      return [...filter.map(arg => arg.name), ...results];
    }
    return [];
  },
  parseOrgRelations: (args: SelectionType[]) => {
    const tourney = args.find(arg => arg.name === tourneyKeyFromOrg);
    if (tourney) {
      return [
        tourneyKeyFromOrg,
        ...parsers.parseTourneyRelations(mapSelectionNodesToSelectionTypes(tourney.set))
          .map(key => `${tourneyKeyFromOrg}.${key}`),
      ];
    }
    return [];
  },
};

export const getRelations = (info: GraphQLResolveInfo, funcName: string, parser: ParseFunc) => {
  const selectionSet: SelectionNode[] = (<any>info.operation.selectionSet.selections)
    .find((obj: any) => obj.name.value === funcName).selectionSet.selections;
  const selections = selectionSet
    .map<SelectionType>((obj: any) => ({ name: obj.name.value, set: obj.selectionSet?.selections }));
  return parser(selections);
};
