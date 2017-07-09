import React from 'react';
import List from 'material-ui/List';
import { connect } from 'react-redux';
import Link from '../Link';
import CityItem from './CityItem';
import { Selectors } from '../../../application';
import { ICity } from '../../../domain';

type StateProps = {
  cities: ICity[];
};

type CitiesListProps = StateProps;

class CitiesList extends React.Component {
  props: CitiesListProps;

  render() {
    const { cities } = this.props;
    return (
      <List>
        {cities.map(city => (
          <Link to={`/city/${city.id}`} key={city.id}>
            <CityItem city={city} />
          </Link>
        ))}
      </List>
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  cities: Selectors.cities.data(state),
});

export default connect(mapStateToProps)(CitiesList);
