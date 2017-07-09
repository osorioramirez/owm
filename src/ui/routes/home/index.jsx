import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default () => ({
  chunks: ['home'],
  title: 'Home',
  component: <Layout><Home /></Layout>,
});

