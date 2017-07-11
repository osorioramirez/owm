/* eslint-env mocha */

import { expect } from 'chai';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import AsyncData, { FETCH, FETCH_SUCCESS, FETCH_FAILURE } from '../AsyncData';
import { Action, createAction } from '../Action';
import moduleTest from './Module.test';

export const actionsTest = (module: AsyncData, fetchPayload?, fetchMeta?) => {
  describe('Actions creator test', () => {
    it(`should create ${module.types[FETCH]} action`, () => {
      const action = module.actions.fetch(fetchPayload, fetchMeta);
      expect(action).to.deep.equal(createAction(module.types[FETCH], fetchPayload, fetchMeta));
    });
  });
};

export const selectorsTest = (module: AsyncData, data) => {
  describe('Selector test', () => {
    it('should select data from store', () => {
      const state = { [module.name]: { ...module.defaultState, data } };
      expect(module.selectors.data(state)).to.be.deep.equal(data);
    });

    it('should select error from store', () => {
      const error = new Error();
      const state = { [module.name]: { ...module.defaultState, error } };
      expect(module.selectors.error(state)).to.be.deep.equal(error);
    });

    it('should select loading from store', () => {
      const state = { [module.name]: { ...module.defaultState, loading: true } };
      expect(module.selectors.isLoading(state)).to.be.equal(true);
    });
  });
};

export const reducerTest = (module: AsyncData, data, fetchPayload?, fetchMeta?) => {
  describe('Reducer test', () => {
    let action: Action;
    let saga;
    let dataProvider;
    before(() => {
      action = module.actions.fetch(fetchPayload, fetchMeta);
      dataProvider = [matchers.call.fn(module.doFetch), data];
    });

    beforeEach(() => {
      saga = expectSaga(module.saga).withReducer(module.reducer, module.defaultState);
    });

    it(`should put data in the store when ${module.types[FETCH_SUCCESS]} action is dispatched`, async () => {
      const { storeState } = await saga
        .provide([dataProvider])
        .dispatch(action)
        .silentRun();

      expect(storeState).to.be.deep.equal({
        data,
        loading: false,
        error: undefined,
      });
    });

    it(`should put error in the store when ${module.types[FETCH_FAILURE]} action is dispatched`, async () => {
      const error = new Error('Fetch failure');
      const { storeState } = await saga
        .provide({
          call(effect, next) {
            if (effect.fn === module.doFetch) {
              throw error;
            }
            return next();
          },
        })
        .dispatch(action)
        .silentRun();

      expect(storeState).to.be.deep.equal({
        ...module.defaultState,
        loading: false,
        error,
      });
    });

    it(`should put loading to true in the store when ${module.types[FETCH]} action is dispatched`, async () => {
      const { storeState } = await saga
        .provide({
          call(effect, next) {
            if (effect.fn === module.doFetch) {
              return new Promise(() => {}); // never resolved
            }
            return next();
          },
        })
        .dispatch(action)
        .silentRun();

      expect(storeState).to.be.deep.equal({
        ...module.defaultState,
        loading: true,
      });
    });
  });
};

export const sagaTest = (module: AsyncData, data, fetchPayload?, fetchMeta?) => {
  describe('Saga test', () => {
    let action: Action;
    before(() => {
      action = module.actions.fetch(fetchPayload, fetchMeta);
    });

    it(`should handle ${module.types[FETCH]} action`, () => (
      expectSaga(module.saga)
        .provide([
          [matchers.call.fn(module.doFetch), data],
        ])
        .take(module.types[FETCH])
        .put(createAction(module.types[FETCH_SUCCESS], { data }))
        .dispatch(action)
        .silentRun()
    ));

    it(`should dispatch ${module.types[FETCH_FAILURE]} action`, () => (
      expectSaga(module.saga)
        .provide({
          call(effect, next) {
            if (effect.fn === module.doFetch) {
              throw new Error('Fetch failure');
            }
            return next();
          },
        })
        .take(module.types[FETCH])
        .put(createAction(module.types[FETCH_FAILURE], new Error('Fetch failure')))
        .dispatch(action)
        .silentRun()
    ));
  });
};

export default (module: AsyncData, data, fetchPayload?, fetchMeta?) => {
  moduleTest(module);
  actionsTest(module, fetchPayload, fetchMeta);
  reducerTest(module, data, fetchPayload, fetchMeta);
  selectorsTest(module, data);
  sagaTest(module, data, fetchPayload, fetchMeta);
};
