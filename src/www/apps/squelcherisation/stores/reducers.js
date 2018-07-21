
import { combineReducers } from 'redux'

import transport from '../components/transport/index';
import throwdown from '../components/throwdown/index';

const app = combineReducers({
  transport: transport.reducer,
  throwdown: throwdown.reducer,
});

export default app;