/* eslint-env mocha */

import asyncDataTest from '../../core/test/AsyncData.test';
import Cities from '../index';

describe('City list', () => {
  const list = new Cities('@test', 'cities');
  asyncDataTest(list, [{ id: 1, name: 'Barcelona' }, { id: 2, name: 'La Habana' }]);
});
