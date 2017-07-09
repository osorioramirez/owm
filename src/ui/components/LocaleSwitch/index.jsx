import React from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Link from '../Link';
import { ILocale } from '../../../domain';
import { Selectors, Actions } from '../../../application';

type StateProps = {
  locale: ILocale;
  locales: ILocale[];
};

type DispatchProps = {
  switch: (locale: ILocale) => void;
};

type LocaleSwitchProps = StateProps & DispatchProps;

type LocaleSwitchState = {
  anchorEl: React.ReactNode;
  open: boolean;
};

class LocaleSwitch extends React.Component {
  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      anchorEl: undefined,
      open: false,
    };
  }

  state: LocaleSwitchState;
  props: LocaleSwitchProps;

  @autobind
  handleOpen(event: React.MouseEvent) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  @autobind
  handleClose() {
    this.setState({ open: false });
  }

  selectLocale(locale: ILocale) {
    const { switchLocale } = this.props;
    switchLocale(locale);
    this.handleClose();
  }

  render() {
    const { open, anchorEl } = this.state;
    const { locale, locales = [] } = this.props;
    return (
      <div>
        <Button color="contrast" aria-owns="simple-menu" aria-haspopup="true" onClick={this.handleOpen}>
          {locale ? locale.name : ''}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={open}
          onRequestClose={this.handleClose}
        >
          { locales.map(item => (
            <MenuItem key={item.id} selected={item.id === locale.id} onClick={() => this.selectLocale(item)}>
              <Link to={`?locale=${item.id}`}>
                {item.name}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  locale: Selectors.locale.current(state),
  locales: Selectors.locale.list.data(state),
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  switchLocale: (locale: ILocale) => dispatch(Actions.locale.switchLocale(locale)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSwitch);
