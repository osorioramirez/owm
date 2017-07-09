import { getContext } from 'redux-saga/effects';

export default function getClient() {
  return getContext('apolloClient');
}
