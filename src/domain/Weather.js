import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';

export interface IWeather {
  main: string;
  description: string;
  icon: string;
  largeIcon: string;
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  pressure: number;
  windSpeed:number;
  windDegrees: number;
  cloudiness: number;
  calculatedAt: number;
  updatedAt: number;
}

class Weather extends GraphQLObjectType {
  constructor() {
    super({
      name: 'Weather',
      fields: {
        main: {
          type: GraphQLString,
          description: 'Group of weather parameters (Rain, Snow, Extreme etc.)',
        },
        description: {
          type: GraphQLString,
          description: 'Weather condition within the group',
        },
        icon: {
          type: GraphQLString,
          description: 'Weather icon url',
        },
        largeIcon: {
          type: GraphQLString,
          description: 'Weather icon url (large)',
        },
        temperature: {
          type: GraphQLFloat,
          description: 'Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.',
        },
        maxTemperature: {
          type: GraphQLFloat,
          description: 'Max temperature.',
        },
        minTemperature: {
          type: GraphQLFloat,
          description: 'Min temperature.',
        },
        pressure: {
          type: GraphQLFloat,
          description: 'Atmospheric pressure, hPa',
        },
        windSpeed: {
          type: GraphQLFloat,
          description: 'Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.',
        },
        windDegrees: {
          type: GraphQLFloat,
          description: 'Wind direction, degrees (meteorological)',
        },
        cloudiness: {
          type: GraphQLFloat,
          description: 'Cloudiness, %',
        },
        calculatedAt: {
          type: GraphQLFloat,
          description: 'Time of data calculation, unix, UTC',
        },
        updatedAt: {
          type: GraphQLFloat,
          description: 'Time of data request, unix, UTC',
        },
      },
    });
  }
}

export default new Weather();
