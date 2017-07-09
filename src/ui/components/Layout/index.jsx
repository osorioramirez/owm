import React from 'react';
import Grid from 'material-ui/Grid';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import css from './layout.css';
import Header from '../Header';
import CitiesList from '../CitiesList';

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
          <Grid container gutter={24}>
            <Grid item xs={3}>
              <CitiesList />
            </Grid>
            <Grid item xs={9}>
              {this.props.children}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

