/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import requestLanguage from 'express-request-language';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import './intlPolyfill';
import App from '../ui/components/App';
import Html from '../ui/components/Html';
import { ErrorPageWithoutStyle } from '../ui/routes/error/ErrorPage';
import errorPageStyle from '../ui/routes/error/ErrorPage.css';
import router from './router';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore, { IExtendedStore } from './store';
import schema from './graphql/schema';
import createApolloClient from './apollo';
import config from './config';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const locales = config.locales.map(locale => locale.id);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(requestLanguage({
  languages: locales,
  queryName: 'locale',
  cookie: {
    name: 'lang',
    options: {
      path: '/',
      maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
    },
    url: '/lang/{language}',
  },
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (__DEV__) {
  app.enable('trust proxy');
}

//
// Register API middleware
// -----------------------------------------------------------------------------
const graphqlMiddleware = expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: { request: req },
  pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const css = new Set();

    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });

    const store: IExtendedStore = await configureStore({}, {
      apolloClient,
      weatherUpdateTime: config.weatherUpdateTime,
      browser: process.env.BROWSER,
    });
    const locale = req.language;
    await store.startUp({ locale });

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      history: null,
    };

    const route = await router.resolve({
      ...context,
      store,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context} store={store}>
        {route.component}
      </App>,
    );
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      state: store.getState(),
      config: {
        weatherUpdateTime: config.weatherUpdateTime,
      },
    };
    delete data.app.state.apollo;

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
