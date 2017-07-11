/* eslint-env mocha */

import asyncDataTest from '../../core/test/AsyncData.test';
import LocaleList from '../LocaleList';

describe('Locale list', () => {
  const list = new LocaleList('@test/locale', 'list');
  asyncDataTest(list, [{ id: 'en', name: 'English' }, { id: 'es', name: 'Español' }]);
});
