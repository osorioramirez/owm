import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import css from './link.css';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

type LinkProps = {
  to: string;
  children: React.ReactNode;
  onClick: React.MouseEventHandler;
}

@withStyles(css)
export default class Link extends React.Component {
  static contextTypes = {
    history: PropTypes.object,
  }

  props: LinkProps;

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    this.context.history.push(this.props.to);
  };

  render() {
    const { to, children, ...props } = this.props;
    return <a href={to} className={css.link} {...props} onClick={this.handleClick}>{children}</a>;
  }
}
