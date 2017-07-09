import { GraphQLEnumType } from 'graphql';

const METRIC = 'metric';
const IMPERIAL = 'imperial';

export const Units = {
  METRIC,
  IMPERIAL,
};

class Unit extends GraphQLEnumType {
  constructor() {
    super({
      name: 'Unit',
      values: {
        metric: { value: METRIC },
        imperial: { value: IMPERIAL },
      },
    });
  }
}

export default new Unit();
