import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import css from './layout.css';
import Header from '../Header';

type LayoutProps = {
  children: React.ReactNode;
}

@withStyles(normalizeCss, css)
export default class Layout extends React.Component {
  props: LayoutProps;

  render() {
    return (
      <div>
        <Header />
        <div className={css.bodyContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
