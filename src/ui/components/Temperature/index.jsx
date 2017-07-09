import React from 'react';

type TemperatureProps = {
  value: number;
  round: boolean;
};

export default class Temperature extends React.Component {
  props: TemperatureProps;

  render() {
    const { round = true, value } = this.props;
    return <span>{`${round ? Math.round(value) : value}ºC`}</span>;
  }
}
