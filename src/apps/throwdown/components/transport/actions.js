import { createAction } from '@reduxjs/toolkit';

const setTempo = createAction( 'transport/setTempo' );
const setNextTempo = createAction( 'tempoDrop/setNextTempo' ); // payload: tempo value
const adjustNextTempo = createAction( 'tempoDrop/adjustNextTempo' ); // payload: relative change +/- in tempo value
const setCurrentBeat = createAction( 'transport/setCurrentBeat' );
const togglePlayback = createAction( 'transport/togglePlayback' );

export default {
  setTempo,
  setNextTempo,
  adjustNextTempo,
  setCurrentBeat,
  togglePlayback,
};
