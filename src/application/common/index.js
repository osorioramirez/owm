import { autobind } from 'core-decorators';
import { Module, IModuleConfig, Action, mergeConfig, createAction } from '../core';
import { ILocale } from '../../domain';

const LOCALE_SWITCHED = 'LOCALE_SWITCHED';

export const Types = {
  LOCALE_SWITCHED,
};

type LocalePayload = {
  locale: ILocale;
};

type Actions = {
  localeSwitched: (locale: ILocale) => Action<LocalePayload>;
}

type Selectors = {
  currentLocale: (state: any) => ILocale;
}

@autobind
export class Common extends Module<{}, Actions, Selectors> {
  constructor(namespace: string, name: string, config: IModuleConfig) {
    super(namespace, name, mergeConfig({
      types: Types,
    }, config));
  }

  ownActions(): Actions {
    return {
      localeSwitched: (locale: ILocale): Action<LocalePayload> => createAction(this.types[LOCALE_SWITCHED], { locale }),
    };
  }

  ownSelectors(): Selectors { // eslint-disable-line class-methods-use-this
    return {
      currentLocale: (state: any): ILocale => state.app.locale.current,
    };
  }
}

const common = new Common('@weather', 'common');
export default common;

