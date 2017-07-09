import React from 'react';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import { Selectors } from '../../../application';
import { ICity } from '../../../domain';
import CityWeather from '../../components/CityWeather';

type StateProps = {
  cities: ICity[];
};

type HomeProps = StateProps;

class Home extends React.Component {
  props: HomeProps;

  render() {
    const { cities } = this.props;
    return (
      <Grid container gutter={24}>
        {cities.map(city => (
          <Grid key={city.id} item xs={6}>
            <CityWeather city={city} compact />
          </Grid>
        ))}
      </Grid>
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  cities: Selectors.cities.data(state),
});

export default connect(mapStateToProps)(Home);
