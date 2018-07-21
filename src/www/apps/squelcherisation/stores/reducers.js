
import { combineReducers } from 'redux'

import transport from '../components/transport/index';

const app = combineReducers({
  transport: transport.reducer,
});

export default app;