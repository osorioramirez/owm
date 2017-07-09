import { autobind } from 'core-decorators';
import { spawn, take, call, put, all } from 'redux-saga/effects';
import { Action, createAction } from './Action';
import Module, { IModuleConfig, mergeConfig } from './Module';

const FETCH = 'FETCH';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

const types = {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
};

export type DataPayload<T> = {
  data: T
};

type ReducerPayload<T> = DataPayload<T> | Error;

export type AsyncDataState<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
}

const defaultState: AsyncDataState<any> = {
  data: undefined,
  loading: false,
  error: undefined,
};

export type AsyncDataActions<FetchPayload = undefined, FetchMeta = undefined> = {
  fetch: <FetchPayload, FetchMeta>(payload?: FetchPayload, meta?: FetchMeta) => Action<FetchPayload, FetchMeta>;
}

export type AsyncDataSelectors<T> = {
  data: (state: any) => T;
  isLoading: (state: any) => boolean;
  error: (state: any) => Error;
}

@autobind
export default class AsyncData<T, Actions = {}, Selectors = {}, ExtraActions = {}, ExtraSelectors = {}>
extends Module<AsyncDataState<T>, AsyncDataActions & Actions, AsyncDataSelectors<T> & Selectors, ExtraActions, ExtraSelectors> { // eslint-disable-line

  constructor(namespace: string, name: string, config: IModuleConfig) {
    super(namespace, name, mergeConfig({ types, defaultState }, config));
  }

  reducer(state: AsyncDataState<T>, action: Action<ReducerPayload<T>>): AsyncDataState<T> {
    state = this.stateOrDefault(state); // eslint-disable-line no-param-reassign
    switch (action.type) {
      case this.types[FETCH]:
        return {
          ...state,
          loading: true,
          error: undefined,
        };
      case this.types[FETCH_SUCCESS]:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
        };
      case this.types[FETCH_FAILURE]:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return super.reducer(state, action);
    }
  }

  ownActions(): AsyncDataActions {
    return {
      fetch: this.fetch,
    };
  }

  ownSelectors(): AsyncDataSelectors {
    return {
      data: (state: any): T => this.select(state, (localState: AsyncDataState<T>) => localState.data),
      isLoading: (state: any): boolean => (
        this.select(state, (localState: AsyncDataState<T>) => localState.loading)
      ),
      error: (state: any): Error => this.select(state, (resourceState: AsyncDataState<T>) => resourceState.error),
    };
  }

  fetch<Payload, Meta>(payload?: Payload, meta?: Meta): Action<Payload, Meta> {
    return createAction(this.types[FETCH], payload, meta);
  }

  success<Meta>(data: T, meta?: Meta): Action<DataPayload<T>, Meta> {
    return createAction(this.types[FETCH_SUCCESS], { data }, meta);
  }

  failure<Meta>(reason?: Error, meta?: Meta): Action<Error, Meta> {
    return createAction(this.types[FETCH_FAILURE], reason, meta);
  }

  * doFetch<Payload>(payload?: Payload) { // eslint-disable-line
    throw new Error('Not implemented method');
  }

  * watchFetch() {
    let action: Action;
    do {
      action = yield take(this.types[FETCH]);
      try {
        const data = yield call(this.doFetch, action.payload);
        yield put(this.success(data));
      } catch (error) {
        yield put(this.failure(error));
      }
    } while (action);
  }

  * saga(): IterableIterator {
    yield all([
      spawn(super.saga),
      spawn(this.watchFetch),
    ]);
  }
}
