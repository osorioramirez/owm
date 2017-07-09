import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat } from 'graphql';

export interface ILatLng {
  lat: number;
  lng: number;
}

class LatLng extends GraphQLObjectType {
  constructor() {
    super({
      name: 'LatLng',
      fields: {
        latitude: {
          type: new GraphQLNonNull(GraphQLFloat),
          description: 'Latitude',
        },
        longitude: {
          type: new GraphQLNonNull(GraphQLFloat),
          description: 'Longitude',
        },
      },
    });
  }
}

export default new LatLng();
