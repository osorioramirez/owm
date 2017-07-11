/* eslint-env mocha */

import asyncDataTest from '../../core/test/AsyncData.test';
import CurrentWeather from '../CurrentWeather';

describe('Current weather', () => {
  const current = new CurrentWeather('@test/weather', 'current');
  asyncDataTest(current, { id: 1, temperature: 30 });
});
