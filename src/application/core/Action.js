import { FluxStandardAction as Action } from 'flux-standard-action';

export { FluxStandardAction as Action } from 'flux-standard-action';
export type ErrorAction<Meta> = Action<Error, Meta>;
export type Type = string | Symbol;

export const createAction = <Payload, Meta>(type: Type, payload: Payload, meta: Meta): Action<Payload, Meta> => ({
  type,
  ...payload ? { payload } : {},
  ...meta ? { meta } : {},
  ...payload instanceof Error ? { error: true } : {},
});
