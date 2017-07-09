import fetch from 'node-fetch';
import URLSearchParams from 'url-search-params';
import { City } from '../../../domain';
import { IOpenWeatherMapCity, IOpenWeatherMapWeather } from './sources';
import config from '../../config';

type WeatherArgs = {
  unit?: string;
  locale:? string;
}

const weather = async (city: IOpenWeatherMapCity, { unit, locale }: WeatherArgs): Promise<IOpenWeatherMapWeather[]> => {
  const params = new URLSearchParams();
  params.append('id', city.id);
  params.append('APPID', config.owm.appId);
  if (unit) {
    params.append('units', unit);
  }
  if (locale) {
    params.append('lang', locale);
  }
  const url = `${config.owm.apiEndPoint}/weather?${params.toString()}`;
  return (await fetch(url)).json();
};

export default {
  [City.name]: {
    weather,
  },
};
