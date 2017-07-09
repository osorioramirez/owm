import { GraphQLSchema } from 'graphql';
import { addResolveFunctionsToSchema } from 'graphql-tools';
import { Root } from '../../domain';
import resolvers from './resolvers';

const schema = new GraphQLSchema({
  query: Root,
});

addResolveFunctionsToSchema(schema, resolvers);
export default schema;
