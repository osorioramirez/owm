import { autobind } from 'core-decorators';
import { updateIntl } from 'react-intl-redux';
import { all, spawn, put, select, take, takeEvery, call } from 'redux-saga/effects';
import { query } from '../core/effects';
import { Module, IModuleConfig, Action, mergeConfig, createAction, FETCH_SUCCESS, FETCH_FAILURE } from '../core';
import { ILocale, IIntlMessage } from '../../domain';
import LocaleList, { LocaleListState, LocaleListActions, LocaleListSelectors } from './LocaleList';
import common from '../common';
import gql from './gql';

const SWITCH_LOCALE = 'SWITCH_LOCALE';

const types = {
  SWITCH_LOCALE,
};

type LocalePayload = {
  locale: ILocale;
};

export type LocaleState = {
  current: ILocale;
  list: LocaleListState;
};

const defaultState = {
  current: undefined,
  list: undefined,
};

type Actions = {
  switchLocale: (locale: ILocale) => Action<LocalePayload>;
}

type Selectors = {
  current: (state: any) => ILocale;
}

type ExtraActions = {
  list: LocaleListActions;
}

type ExtraSelectors = {
  list: LocaleListSelectors;
}

export type LocaleActions = Actions & ExtraActions;
export type LocaleSelectors = Selectors & ExtraSelectors;

@autobind
export default class Locale extends Module<LocaleState, Actions, Selectors, ExtraActions, ExtraSelectors> {
  list: LocaleList;

  constructor(namespace: string, name: string, config: IModuleConfig) {
    super(namespace, name, mergeConfig({
      types,
      defaultState,
      modules: [
        new LocaleList(Module.modulesNamespace(namespace, name), 'list'),
      ],
    }, config));
  }

  reducer(state: LocaleState, action: Action<LocalePayload>): LocaleState {
    state = this.stateOrDefault(state); // eslint-disable-line no-param-reassign
    switch (action.type) {
      case this.types[SWITCH_LOCALE]:
        return {
          ...state,
          current: action.payload.locale,
        };
      default:
        return super.reducer(state, action);
    }
  }

  ownActions(): Actions {
    return {
      switchLocale: (locale: ILocale): Action<LocalePayload> => createAction(this.types[SWITCH_LOCALE], { locale }),
    };
  }

  ownSelectors(): Selectors {
    return {
      current: (state: any): ILocale => this.select(state, (localState: LocaleState) => localState.current),
    };
  }

  * switchLocale(locale: ILocale): IterableIterator { // eslint-disable-line class-methods-use-this
    const data: { translations: IIntlMessage[] } = yield query(
      gql.queries.translations,
      { locale: locale.id },
    );
    if (data && data.translations) {
      yield put(updateIntl({
        locale: locale.id,
        messages: data.translations.reduce((messages, translation) => ({
          ...messages,
          [translation.messageId]: translation.message,
        }), {}),
      }));
    }
  }

  * handleSwitchLocale(action: Action<LocalePayload>): IterableIterator {
    yield call(this.switchLocale, action.payload.locale);
    yield put(common.actions.localeSwitched(action.payload.locale));
  }

  * saga(): IterableIterator {
    yield all([
      spawn(super.saga),
      takeEvery(this.types[SWITCH_LOCALE], this.handleSwitchLocale),
    ]);
  }

  * startUpSaga({ locale }: { locale: string}): IterableIterator {
    // fetch locales
    yield put(this.actions.list.fetch());
    // wait to fetch finished
    const action: Action = yield take([this.list.types[FETCH_SUCCESS], this.list.types[FETCH_FAILURE]]);
    if (action.type === this.list.types[FETCH_SUCCESS] && locale) {
      const state = yield select();
      const locales = this.selectors.list.data(state);
      const current = locales.find(item => item.id === locale);
      if (current) {
        yield call(this.switchLocale, current);
        yield put(this.actions.switchLocale(current));
      }
    } else if (action.type === this.list.types[FETCH_FAILURE]) {
      throw new Error('Fetch locales failure');
    }
  }
}
