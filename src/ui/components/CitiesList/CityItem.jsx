import React from 'react';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import Temperature from '../Temperature';
import { Selectors } from '../../../application';
import { ICity, IWeather } from '../../../domain';

type StateProps = {
  weather: IWeather;
  loadingWeather: boolean;
};

type OwnProps = {
  city: ICity;
};

type CityItemProps = StateProps & OwnProps;

class CityItem extends React.Component {
  props: CityItemProps;

  render() {
    const { city, weather } = this.props;
    return (
      <ListItem button>
        <Avatar src={weather && weather.icon} />
        <ListItemText primary={city.name} secondary={weather && weather.description} />
        <Typography type="headline" component="h2">
          { weather && <Temperature value={weather.temperature} />}
        </Typography>
      </ListItem>
    );
  }
}

const mapStateToProps = (state: any, props: OwnProps): StateProps => ({
  weather: Selectors.weather.currentByCity(state, props.city.id),
});

export default connect(mapStateToProps)(CityItem);
