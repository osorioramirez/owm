import { Root, ILocale, ICity } from '../../../domain';
import translations from './translations';
import config from '../../config';

const citiesData = require('./cities.json');

const locales = (): ILocale[] => config.locales;
const cities = (): ICity[] => citiesData.map(data => ({
  ...data,
  coordinate: {
    latitude: data.coord.lat,
    longitude: data.coord.lon,
  },
}));

export default {
  [Root.name]: {
    locales,
    translations,
    cities,
  },
};
