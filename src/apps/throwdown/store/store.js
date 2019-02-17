import { configureStore } from 'redux-starter-kit';

import transportReducer from './transport/reducer';
import tempoDropReducer from '../components/tempo-drop/reducer';

const store = configureStore({
  reducer: {
    transport: transportReducer,
    tempoDrop: tempoDropReducer, 
  }
})
export default store;