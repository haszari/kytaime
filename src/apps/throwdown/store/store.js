import { configureStore } from 'redux-starter-kit';

import transportReducer from '../components/transport/reducer';
import throwdownReducer from '../components/throwdown/reducer';

const store = configureStore({
  reducer: {
    throwdown: throwdownReducer,
    transport: transportReducer,
  }
})
export default store;