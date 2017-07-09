import { createStore, applyMiddleware, compose, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { intlReducer } from 'react-intl-redux';
import createReducer from './reducer';
import app from '../../application';
import createLogger from './logger';

export interface IExtendedStore extends Store {
  startUp(config?: any): Promise;
}

export default (state, context) => {
  const { apolloClient } = context;
  const sagaMiddleware = createSagaMiddleware();

  const middleware = [
    apolloClient.middleware(),
    sagaMiddleware,
  ];

  let enhancer;

  if (__DEV__) {
    middleware.push(createLogger());

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f;
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension();
    }

    enhancer = compose(
      applyMiddleware(...middleware),
      devToolsExtension,
    );
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  const reducer = createReducer({
    apollo: apolloClient.reducer(),
    intl: intlReducer,
  });

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(reducer, state, enhancer);

  sagaMiddleware.setContext(context);
  sagaMiddleware.run(app.saga);

  store.startUp = (startUpConfig?: any) => sagaMiddleware.run(app.startUpSaga, startUpConfig).done;

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('./reducer', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('./reducer').default),
    );
  }

  return store;
};
