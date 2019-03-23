import { createAction } from 'redux-starter-kit';

const setTempo = createAction( 'transport/setTempo' );
const setNextTempo = createAction( 'tempoDrop/setNextTempo' );
const setCurrentBeat = createAction( 'transport/setCurrentBeat' );
const togglePlayback = createAction( 'transport/togglePlayback' );

export default {
  setTempo,
  setNextTempo,
  setCurrentBeat,
  togglePlayback,
};