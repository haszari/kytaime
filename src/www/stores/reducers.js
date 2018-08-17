
import { combineReducers } from 'redux'

import transport from '../components/transport/index';
import decks from '../components/decks/index';

const app = combineReducers({
  transport: transport.reducer,
  decks: decks.reducer,
});

export default app;