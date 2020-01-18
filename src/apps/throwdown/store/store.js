import { configureStore } from '@reduxjs/toolkit';

import transportReducer from '../components/transport/reducer';
import throwdownReducer from '../components/throwdown/reducer';
import dragDropReducer from '../components/drag-drop/reducer';

const store = configureStore( {
  reducer: {
    throwdown: throwdownReducer,
    transport: transportReducer,
    dragDrop: dragDropReducer,
  },
} );
export default store;
