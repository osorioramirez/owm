import { call } from 'redux-saga/effects';
import ApolloClient, { WatchQueryOptions, ApolloQueryResult, DocumentNode } from 'apollo-client';
import getClient from './getClient';

export type Variables = {
  [variable: string]: any
};

function* handleQuery<T>(options: WatchQueryOptions) {
  const client: ApolloClient = yield getClient();
  const response: ApolloQueryResult<T> = yield call(async () => client.query(options), options);
  return yield response.data;
}

export default function queryEffect<T>(query: DocumentNode, variables?: Variables, options?: WatchQueryOptions): T {
  return call(handleQuery, { query, variables, ...options });
}
