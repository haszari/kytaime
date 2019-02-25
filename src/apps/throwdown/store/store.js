import { configureStore } from 'redux-starter-kit';

import transportReducer from './transport/reducer';
import tempoDropReducer from '../components/tempo-drop/reducer';
import throwdownReducer from '../components/throwdown/reducer';

const store = configureStore({
  reducer: {
    throwdown: throwdownReducer,
    transport: transportReducer,
    tempoDrop: tempoDropReducer, 
  }
})
export default store;