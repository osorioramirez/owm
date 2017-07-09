import React from 'react';

type TemperatureProps = {
  value: number;
  round: boolean;
};

export const formatTemperature = (temperature: number, round = true) => (
  `${round ? Math.round(temperature) : temperature}ºC`
);

export default class Temperature extends React.Component {
  props: TemperatureProps;

  render() {
    const { value, round } = this.props;
    return <span>{formatTemperature(value, round)}</span>;
  }
}
