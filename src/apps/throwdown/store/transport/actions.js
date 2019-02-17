import { createAction } from 'redux-starter-kit';

const setTempo = createAction( 'transport/setTempo' );
const togglePlayback = createAction( 'transport/togglePlayback' );

export default {
  setTempo,
  togglePlayback,
};