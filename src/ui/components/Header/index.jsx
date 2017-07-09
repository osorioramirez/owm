/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';
import LocaleSwitch from '../LocaleSwitch';
import css from './header.css';
import messages from './messages';

@withStyles(css)
export default class Header extends React.Component {

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={css.title}>
              <FormattedMessage {...messages.title} />
            </Typography>
            <LocaleSwitch />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
