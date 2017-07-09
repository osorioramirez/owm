import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import Temperature from '../Temperature';
import { IWeather } from '../../../domain';
import messages from './messages';

console.log(messages);

type CityWeatherDetailsProps = {
  weather: IWeather;
};

export default class CityWeatherDetails extends React.Component {
  props: CityWeatherDetailsProps;

  render() {
    const { weather } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.details} /></TableCell>
            <TableCell compact />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.temperature} /></TableCell>
            <TableCell compact numeric><Temperature value={weather.temperature} round={false} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.minTemperature} /></TableCell>
            <TableCell compact numeric><Temperature value={weather.minTemperature} round={false} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.maxTemperature} /></TableCell>
            <TableCell compact numeric><Temperature value={weather.maxTemperature} round={false} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.pressure} /></TableCell>
            <TableCell compact numeric>{`${weather.pressure} hPa`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.windSpeed} /></TableCell>
            <TableCell compact numeric>{`${weather.windSpeed} m/s`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.cloudiness} /></TableCell>
            <TableCell compact numeric>{`${weather.cloudiness} %`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell compact><FormattedMessage {...messages.calculatedAt} /></TableCell>
            <TableCell compact numeric><FormattedRelative value={new Date(weather.calculatedAt)} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
