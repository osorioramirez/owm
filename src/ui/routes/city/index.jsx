/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import City from './City';
import Layout from '../../components/Layout';
import { Selectors } from '../../../application';

export default ({ params: { id }, store }) => {
  const city = Selectors.cities.getById(store.getState(), id);
  return {
    chunks: ['city'],
    title: city.name,
    component: <Layout><City city={city} /></Layout>,
  };
};

