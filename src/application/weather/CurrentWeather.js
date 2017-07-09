import { autobind } from 'core-decorators';
import { select } from 'redux-saga/effects';
import { AsyncData, AsyncDataState, AsyncDataActions, AsyncDataSelectors } from '../core';
import { query } from '../core/effects';
import common from '../common';
import { IWeather, ICity, ILocale, Units } from '../../domain';
import gql from './gql';

export type CitiesWeather = {[id: string]: IWeather};
export type CurrentWeatherState = AsyncDataState<CitiesWeather>;
export type CurrentWeatherActions = AsyncDataActions;
export type CurrentWeatherSelectors = AsyncDataSelectors<CitiesWeather>;

@autobind
export default class CurrentWeather extends AsyncData<CitiesWeather> {

  * doFetch() {
    const state = yield select();
    const locale: ILocale = common.selectors.currentLocale(state);
    const last = this.selectors.data(state);
    const data: { cities: ICity[] } = yield query(
      gql.queries.weather,
      { locale: locale.id, unit: Units.METRIC },
      { fetchPolicy: 'network-only' },
    );
    const current: CitiesWeather = data.cities.reduce((weathers: CitiesWeather, city: ICity) => ({
      ...weathers,
      [city.id]: city.weather,
    }), {});
    return {
      ...last,
      ...current,
    };
  }
}
