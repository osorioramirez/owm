/* eslint-env mocha */

import moduleTest from './core/test/Module.test';
import app from './index';

describe('App root', () => {
  moduleTest(app);
});
