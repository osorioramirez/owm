import { autobind } from 'core-decorators';
import { Module, IModuleConfig, mergeConfig } from './core';
import Locale, { LocaleState, LocaleActions, LocaleSelectors } from './locale';
import Cities, { CitiesState, CitiesActions, CitiesSelectors } from './cities';
import Weather, { WeatherState, WeatherActions, WeatherSelectors } from './weather';

export type AppState = {
  locale: LocaleState;
  cities: CitiesState;
  weather: WeatherState;
};

const defaultState = {
  locales: undefined,
  cities: undefined,
  weather: undefined,
};

type ExtraActions = {
  locale: LocaleActions;
  cities: CitiesActions;
  weather: WeatherActions;
}

type ExtraSelectors = {
  locale: LocaleSelectors;
  cities: CitiesSelectors;
  weather: WeatherSelectors;
}

@autobind
class App extends Module<AppState, {}, {}, ExtraActions, ExtraSelectors> {
  locale: Locale;
  cities: Cities;
  weather: Weather;

  constructor(namespace: string, name: string, config: IModuleConfig) {
    super(namespace, name, mergeConfig({
      defaultState,
      modules: [
        new Locale(Module.modulesNamespace(namespace, name), 'locale'),
        new Cities(Module.modulesNamespace(namespace, name), 'cities'),
        new Weather(Module.modulesNamespace(namespace, name), 'weather'),
      ],
    }, config));
  }
}

const app = new App('@weather', 'app');
export default app;
export const Actions = app.actions;
export const Selectors = app.selectors;
