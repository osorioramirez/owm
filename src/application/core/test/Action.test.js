/* eslint-env mocha */

import { expect } from 'chai';
import { createAction } from '../Action';

describe('Action creator', () => {
  it('should create action', () => {
    expect(createAction('TYPE')).to.deep.equal({
      type: 'TYPE',
    });
  });

  it('should create action with payload', () => {
    expect(createAction('TYPE', { data: 1 })).to.deep.equal({
      type: 'TYPE',
      payload: { data: 1 },
    });
  });

  it('should create action with payload and metadata', () => {
    expect(createAction('TYPE', { data: 1 }, { meta: 'meta' })).to.deep.equal({
      type: 'TYPE',
      payload: { data: 1 },
      meta: { meta: 'meta' },
    });
  });

  it('should create error action', () => {
    const error = new Error();
    expect(createAction('TYPE', error)).to.deep.equal({
      type: 'TYPE',
      payload: error,
      error: true,
    });
  });
});

