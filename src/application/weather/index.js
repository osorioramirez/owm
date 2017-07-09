import { autobind } from 'core-decorators';
import { all, spawn, put, take, takeEvery, getContext, call, cancelled } from 'redux-saga/effects';
import { timer } from '../core/effects';
import { Module, IModuleConfig, Action, mergeConfig, createAction, DataPayload, FETCH_SUCCESS } from '../core';
import CurrentWeather, { CurrentWeatherState, CurrentWeatherActions, CurrentWeatherSelectors, CitiesWeather } from './CurrentWeather';
import common, { Types as CommonTypes } from '../common';
import { IWeather } from '../../domain';

const UPDATE_HISTORICAL = 'UPDATE_HISTORICAL';

const types = {
  UPDATE_HISTORICAL,
};

type CitiesWeatherPayload = {
  weathers: CitiesWeather;
};

type HistoricalCitiesWeather = { [id: string]: IWeather[] };
export type WeatherState = {
  current: CurrentWeatherState;
  historical: HistoricalCitiesWeather;
};

const defaultState = {
  current: undefined,
  historical: {},
};

type Actions = {
  updateHistorical: (weathers: CitiesWeather) => Action<CitiesWeatherPayload>;
}

type Selectors = {
  currentByCity: (state: any, cityId: string) => IWeather;
  historicalByCity: (state: any, cityId: string) => IWeather[];
}

type ExtraActions = {
  current: CurrentWeatherActions;
}

type ExtraSelectors = {
  current: CurrentWeatherSelectors;
}

export type WeatherActions = Actions & ExtraActions;
export type WeatherSelectors = Selectors & ExtraSelectors;

@autobind
export default class Weather extends Module<WeatherState, Actions, Selectors, ExtraActions, ExtraSelectors> {
  current: CurrentWeather;

  constructor(namespace: string, name: string, config: IModuleConfig) {
    super(namespace, name, mergeConfig({
      types,
      defaultState,
      modules: [
        new CurrentWeather(Module.modulesNamespace(namespace, name), 'current'),
      ],
    }, config));
  }

  reducer(state: WeatherState, action: Action<CitiesWeatherPayload>): WeatherState {
    state = this.stateOrDefault(state); // eslint-disable-line no-param-reassign
    switch (action.type) {
      case this.types[UPDATE_HISTORICAL]:
        return {
          ...state,
          historical: this.historicalUpdated(state.historical, action.payload.weathers),
        };
      default:
        return super.reducer(state, action);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  historicalUpdated(historical: HistoricalCitiesWeather, weathers: CitiesWeather): HistoricalCitiesWeather {
    return {
      ...historical,
      ...Object.keys(weathers).reduce((updated: HistoricalCitiesWeather, cityId) => ({
        ...updated,
        [cityId]: [...(historical[cityId] || []), weathers[cityId]],
      }), {}),
    };
  }

  ownActions(): Actions {
    return {
      updateHistorical: (weathers: CitiesWeather): Action<CitiesWeatherPayload> => (
        createAction(this.types[UPDATE_HISTORICAL], { weathers })
      ),
    };
  }

  ownSelectors(): Selectors {
    return {
      currentByCity: (state: any, cityId: string): IWeather => (
        this.select(state, (localState: WeatherState) => (
          localState.current.data && localState.current.data[cityId]
        ))
      ),
      historicalByCity: (state: any, cityId: string): IWeather[] => (
        this.select(state, (localState: WeatherState) => localState.historical.data[cityId])
      ),
    };
  }

  * updateFlow(): IterableIterator {
    const browser = yield getContext('browser');
    if (browser) { // only update the weather in client side
      const weatherUpdateTime = yield getContext('weatherUpdateTime');
      const timerChannel = yield call(timer, weatherUpdateTime || 180000); // 3 min
      try {
        do {
          // update current weather
          yield put(this.actions.current.fetch());
        } while (yield take(timerChannel));// wait for the next tick
      } finally {
        if (yield cancelled()) {
          timerChannel.close();
        }
      }
    }
  }

  * handleLocaleSwitched(): IterableIterator {
    const browser = yield getContext('browser');
    if (browser) { // only update the weather in client side
      yield put(this.actions.current.fetch());
    }
  }

  * handleCurrentFetchSuccess(action: Action<DataPayload<CitiesWeather>>): IterableIterator {
    yield put(this.actions.updateHistorical(action.payload.data));
  }

  * saga(): IterableIterator {
    yield all([
      spawn(super.saga),
      spawn(this.updateFlow),
      takeEvery(this.current.types[FETCH_SUCCESS], this.handleCurrentFetchSuccess),
      takeEvery(common.types[CommonTypes.LOCALE_SWITCHED], this.handleLocaleSwitched),
    ]);
  }
}
