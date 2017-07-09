import React from 'react';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { FormattedRelative } from 'react-intl';
import CityWeatherDetails from './CityWeatherDetails';
import Temperature from '../Temperature';
import { Selectors } from '../../../application';
import { ICity, IWeather } from '../../../domain';
import css from './city-weather.css';

type StateProps = {
  weather: IWeather;
};

type OwnProps = {
  city: ICity;
  compact: boolean;
};

type CityWeatherProps = StateProps & OwnProps;

@withStyles(css)
class CityWeather extends React.Component {
  props: CityWeatherProps;

  render() {
    const { city, weather, compact } = this.props;
    return (
      <Card className={css.root}>
        <div className={css.row}>
          <CardContent color="primary">
            <Typography type="headline">
              {city.name} <Temperature value={weather && weather.temperature} />
            </Typography>
            {weather && (
              <div>
                <Typography type="subheading" color="secondary">{weather.description}</Typography>
                <Typography type="subheading" color="secondary">
                  <FormattedRelative value={new Date(weather.updatedAt)} />
                </Typography>
              </div>
            )}
          </CardContent>
          <CardMedia className={css.alignRight}>
            <Avatar src={weather && weather.largeIcon} className={css.weatherIcon} />
          </CardMedia>
        </div>
        {!compact && (
          <CardContent>
            { weather && <CityWeatherDetails weather={weather} />}
          </CardContent>
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state, props: OwnProps): StateProps => ({
  weather: Selectors.weather.currentByCity(state, props.city.id),
});

export default connect(mapStateToProps)(CityWeather);
