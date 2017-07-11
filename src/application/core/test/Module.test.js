/* eslint-env mocha */

import { expectSaga } from 'redux-saga-test-plan';
import { IModule } from '../Module';

export default (module: IModule) => {
  it('should spawned all sub module sagas', () => {
    const saga = expectSaga(module.saga);
    module.modules.forEach((item) => {
      saga.spawn(item.saga);
    });
    return saga.silentRun();
  });
};
