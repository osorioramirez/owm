import { autobind } from 'core-decorators';
import { Reducer, ReducersMapObject, combineReducers } from 'redux';
import { select as selectEffect, spawn, fork, all, join } from 'redux-saga/effects';
import { Type, Action } from './Action';

export type ActionTypes = {
  [type: string]: Type;
}

export interface IModule<State, Actions, Selectors, ExtraActions, ExtraSelectors> {
  namespace: string;
  name: string;
  types?: ActionTypes;
  defaultState?: State;
  parent?: IModule;
  modules?: IModule<any>[];
  actions: Actions & ExtraActions;
  selectors: Selectors & ExtraSelectors;
  reducer(state: State, action: Action): State;
  ownActions(): Actions;
  ownSelectors(): Selectors;
  saga(): IterableIterator;
  startUpSaga(): IterableIterator;
}

export interface IModuleConfig<State> {
  types?: ActionTypes;
  defaultState?: State;
  modules?: IModule<any>[];
}

export const mergeConfig = (config1: IModuleConfig = {}, config2: IModuleConfig = {}) => ({
  types: {
    ...config1.types,
    ...config2.types,
  },
  defaultState: {
    ...config1.defaultState,
    ...config2.defaultState,
  },
  modules: [
    ...(config1.modules || []),
    ...(config2.modules || []),
  ],
});

const concatNamespace = (namespace: string, name: string): string => `${namespace}/${name}`;

const createTypes = (namespace: string, name: string, types: ActionTypes) => {
  const typeValue = (typeName: string) => concatNamespace(namespace, concatNamespace(name, typeName.toUpperCase()));
  return Object.keys(types).reduce(
    (realTypes: ActionTypes, typeName: string) => ({
      ...realTypes,
      [typeName]: typeValue(typeName),
    }),
    {},
  );
};

const reducers = (modules: IModule[]): ReducersMapObject => (
  modules.reduce(
    (reducersMap: ReducersMapObject, module: IModule) => ({
      ...reducersMap,
      [module.name]: module.reducer,
    }),
    {},
  )
);

const modulesState = (state: any, modules: IModule[]): any => (
  modules.reduce(
    (actualState: any, module: IModule) => ({
      ...actualState,
      [module.name]: state[module.name],
    }),
    {},
  )
);

@autobind
export default class Module<State, Actions, Selectors, ExtraActions = {}, ExtraSelectors = {}>
implements IModule<State, Actions, Selectors, ExtraActions, ExtraSelectors> {
  modulesReducer: Reducer;
  actions: Actions & ExtraActions;
  selectors: Selectors & ExtraSelectors;

  constructor(namespace: string, name: string, config: IModuleConfig = {}) {
    this.namespace = namespace;
    this.name = name;
    this.actions = { ...this.ownActions() };
    this.selectors = { ...this.ownSelectors() };
    this.types = createTypes(this.namespace, this.name, config.types);
    this.defaultState = config.defaultState || {};
    this.modules = config.modules || [];
    this.modules.forEach((module) => {
      // setting module refs
      this[module.name] = module;
      module.parent = this; // eslint-disable-line no-param-reassign
      // setting extra actions & selectors
      this.actions[module.name] = module.actions;
      this.selectors[module.name] = module.selectors;
    });
    this.modulesReducer = this.modules.length > 0 && combineReducers(reducers(this.modules));
  }

  reducer(state: State, action: Action): State {
    state = this.stateOrDefault(state); // eslint-disable-line no-param-reassign
    if (this.modulesReducer) {
      return {
        ...state,
        ...this.modulesReducer(modulesState(state, this.modules), action),
      };
    }
    return state;
  }

  ownActions(): Actions { // eslint-disable-line class-methods-use-this
    return {};
  }

  ownSelectors(): Selectors { // eslint-disable-line class-methods-use-this
    return {};
  }

  stateOrDefault(state: State): State {
    return state || this.defaultState;
  }

  select<T>(state: any, selector?: (state: State) => T): T {
    const realState = (this.parent ? this.parent.select(state) : state)[this.name];
    return selector ? selector(realState) : realState;
  }

  * stateSelect<T>(selector?: (state: State) => T): IterableIterator {
    const state = yield selectEffect();
    return this.select(state, selector);
  }

  * saga(): IterableIterator { // eslint-disable-line class-methods-use-this
    if (this.modules.length > 0) {
      yield all(this.modules.map(module => spawn(module.saga)));
    }
  }

  * startUpSaga(config): IterableIterator {
    if (this.modules.length > 0) {
      const tasks = yield all(this.modules.map(module => fork(module.startUpSaga, config)));
      yield join(...tasks);
    }
  }

  static modulesNamespace(namespace: string, name: string): string {
    return concatNamespace(namespace, name);
  }
}
