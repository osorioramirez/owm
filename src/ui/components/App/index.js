/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Store } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl-redux';
import { MuiThemeProvider } from 'material-ui/styles';

const ContextType = {
  insertCss: PropTypes.func.isRequired,
  history: PropTypes.object,
};

type AppProps = {
    context: any;
    store: Store<any>;
    children: ReactNode;
}

class App extends React.PureComponent {
  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  props: AppProps;

  render() {
    const { store, children } = this.props;
    return (
      <MuiThemeProvider>
        <ReduxProvider store={store}>
          <IntlProvider>
            {React.Children.only(children)}
          </IntlProvider>
        </ReduxProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
