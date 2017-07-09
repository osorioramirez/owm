import { ReducersMapObject, combineReducers } from 'redux';
import app from '../../application';

export default (reducers: ReducersMapObject) => (
  combineReducers({
    ...reducers,
    [app.name]: app.reducer,
  })
);
