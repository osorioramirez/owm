import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export interface ILocale {
  id: string;
  name: string;
}

class Locale extends GraphQLObjectType {
  constructor() {
    super({
      name: 'Locale',
      fields: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'Locale code, e.g. en, es',
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Locale name',
        },
      },
    });
  }
}

export default new Locale();
