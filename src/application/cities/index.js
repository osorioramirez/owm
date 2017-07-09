import { autobind } from 'core-decorators';
import { put, take } from 'redux-saga/effects';
import { Action, AsyncData, AsyncDataState, AsyncDataActions, AsyncDataSelectors, FETCH_SUCCESS, FETCH_FAILURE } from '../core';
import { query } from '../core/effects';
import { ICity } from '../../domain';
import gql from './gql';

type Selectors = {
  getById: (state: any, id: string) => ICity;
}

export type CitiesState = AsyncDataState<ICity[]>;
export type CitiesActions = AsyncDataActions;
export type CitiesSelectors = AsyncDataSelectors<ICity[]> & Selectors;

@autobind
export default class Cities extends AsyncData<ICity[], {}, Selectors> {

  ownSelectors(): Selectors {
    return {
      ...super.ownSelectors(),
      getById: (state: any, id: string): ICity => (
        this.select(state, (localState: CitiesState) => localState.data.find(city => city.id === id))
      ),
    };
  }

  * doFetch(): IterableIterator { // eslint-disable-line
    const data: { cities: ICity[] } = yield query(gql.queries.cities);
    return data.cities;
  }

  * startUpSaga(): IterableIterator {
    // fetch cities
    yield put(this.actions.fetch());
    // wait to fetch finished
    const action: Action = yield take([this.types[FETCH_SUCCESS], this.types[FETCH_FAILURE]]);
    if (action.type === this.types[FETCH_FAILURE]) {
      console.error(action.payload);
      throw new Error('Fetch cities failure');
    }
  }
}
