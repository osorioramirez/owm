import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export interface IIntlMessage {
  id: string;
  messageId: string;
  message: string;
}

class IntlMessage extends GraphQLObjectType {
  constructor() {
    super({
      name: 'IntlMessage',
      fields: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        messageId: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Message id',
        },
        message: {
          type: GraphQLString,
          description: 'Message text',
        },
      },
    });
  }
}

export default new IntlMessage();
