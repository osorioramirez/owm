import { autobind } from 'core-decorators';
import { AsyncData, AsyncDataState, AsyncDataActions, AsyncDataSelectors } from '../core';
import { query } from '../core/effects';
import { ILocale } from '../../domain';
import gql from './gql';

export type LocaleListState = AsyncDataState<ILocale[]>;
export type LocaleListActions = AsyncDataActions;
export type LocaleListSelectors = AsyncDataSelectors<ILocale[]>;

@autobind
export default class LocaleList extends AsyncData<ILocale[]> {

  * doFetch() { // eslint-disable-line class-methods-use-this
    const data: { locales: ILocale[] } = yield query(gql.queries.locales);
    return data.locales;
  }
}
