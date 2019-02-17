import { createAction } from 'redux-starter-kit';

const setTempo = createAction( 'transport/setTempo' );

export default {
  setTempo,
};