/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Grid from 'material-ui/Grid';
import CitiesList from '../../components/CitiesList';
import CityWeather from '../../components/CityWeather';
import { ICity } from '../../../domain';

type CityProps = {
  city: ICity;
}

export default class City extends React.Component {
  props: CityProps;

  render() {
    const { city } = this.props;
    return (
      <Grid container gutter={24}>
        <Grid item xs={3}>
          <CitiesList />
        </Grid>
        <Grid item xs={9}>
          <CityWeather city={city} />
        </Grid>
      </Grid>
    );
  }
}
