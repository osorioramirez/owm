import { Weather } from '../../../domain';
import { IOpenWeatherMapWeather } from './sources';

const main = (weather: IOpenWeatherMapWeather): string => weather.weather[0].main;
const description = (weather: IOpenWeatherMapWeather): string => weather.weather[0].description;
const icon = (weather: IOpenWeatherMapWeather): string => `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
const largeIcon = (weather: IOpenWeatherMapWeather): string => `http://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${weather.weather[0].icon}.png`;
const temperature = (weather: IOpenWeatherMapWeather): number => weather.main.temp;
const maxTemperature = (weather: IOpenWeatherMapWeather): number => weather.main.temp_max;
const minTemperature = (weather: IOpenWeatherMapWeather): number => weather.main.temp_min;
const pressure = (weather: IOpenWeatherMapWeather): number => weather.main.pressure;
const windSpeed = (weather: IOpenWeatherMapWeather): number => weather.wind.speed;
const windDegrees = (weather: IOpenWeatherMapWeather): number => weather.wind.deg;
const cloudiness = (weather: IOpenWeatherMapWeather): number => weather.clouds.all;
const calculatedAt = (weather: IOpenWeatherMapWeather): number => weather.dt * 1000;
const updatedAt = (): number => Date.now().valueOf();

export default {
  [Weather.name]: {
    main,
    description,
    icon,
    largeIcon,
    temperature,
    maxTemperature,
    minTemperature,
    pressure,
    windSpeed,
    windDegrees,
    cloudiness,
    calculatedAt,
    updatedAt,
  },
};
