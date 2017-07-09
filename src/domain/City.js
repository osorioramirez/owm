import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import LatLng, { ILatLng } from './LatLng';
import Weather, { IWeather } from './Weather';
import Unit from './Unit';

export interface ICity {
  id: string;
  name: string;
  country: string;
  coordinate: ILatLng;
  weather: IWeather;
}

class City extends GraphQLObjectType {
  constructor() {
    super({
      name: 'City',
      fields: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'City id',
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'City name',
        },
        country: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Country code',
        },
        coordinate: {
          type: new GraphQLNonNull(LatLng),
          description: 'Geo coordinates',
        },
        weather: {
          type: new GraphQLNonNull(Weather),
          description: 'Current weather data',
          args: {
            unit: {
              type: Unit,
              description: 'metric, imperial. By default metric',
            },
            locale: {
              type: GraphQLString,
              description: 'Locale code',
            },
          },
        },
      },
    });
  }
}

export default new City();
