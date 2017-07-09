import React from 'react';
import CityWeather from '../../components/CityWeather';
import { ICity } from '../../../domain';

type CityProps = {
  city: ICity;
}

export default class City extends React.Component {
  props: CityProps;

  render() {
    const { city } = this.props;
    return <CityWeather city={city} />;
  }
}
