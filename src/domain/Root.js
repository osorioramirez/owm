import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Locale from './Locale';
import IntlMessage from './IntlMessage';
import City from './City';

class Root extends GraphQLObjectType {
  constructor() {
    super({
      name: 'Root',
      fields: {
        locales: {
          type: new GraphQLList(Locale),
          description: 'List of available locales',
        },
        translations: {
          type: new GraphQLList(IntlMessage),
          description: 'List of translations messages',
          args: {
            locale: { type: new GraphQLNonNull(GraphQLString) },
          },
        },
        cities: {
          type: new GraphQLList(City),
          description: 'List of cities',
        },
      },
    });
  }
}

export default new Root();
