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

