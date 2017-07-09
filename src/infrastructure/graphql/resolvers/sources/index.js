export interface IOpenWeatherMapLatLng {
  lat: number;
  lon: number;
}

export interface IOpenWeatherMapCity {
  id: number;
  name: string;
  country: string;
  coord: IOpenWeatherMapLatLng;
}

export interface IOpenWeatherMapWeather extends IOpenWeatherMapCity {
  id: number;
  name: string;
  weather: {
    id: 801,
    main: string;
    description: string;
    icon: string;
  },
  main: {
      temp: number;
      pressure: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
  },
  wind: {
    speed: number;
    deg: number;
  },
  clouds: {
    all: number;
  },
  dt: number;
}
