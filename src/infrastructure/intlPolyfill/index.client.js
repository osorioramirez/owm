import { addLocaleData } from 'react-intl';

if (!global.Intl) {
  // No `Intl`, so use and load the polyfill.
  require('intl'); // eslint-disable-line global-require
  require('intl/locale-data/jsonp/en.js'); // eslint-disable-line global-require
  require('intl/locale-data/jsonp/es.js'); // eslint-disable-line global-require
}

const en = require('react-intl/locale-data/en'); // eslint-disable-line global-require
const es = require('react-intl/locale-data/es'); // eslint-disable-line global-require

addLocaleData(en);
addLocaleData(es);
