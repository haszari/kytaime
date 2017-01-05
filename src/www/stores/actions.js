


import { TRANSPORT_CURRENT_BEAT, TRANSPORT_PLAYSTATE } from './action-types';

export function transportPlayState(playState) {
   return { type: TRANSPORT_PLAYSTATE, playState: playState };
}

export function transportCurrentBeat(beatNumber) {
   return { type: TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}
