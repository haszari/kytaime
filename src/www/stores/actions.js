


import { TRANSPORT_CURRENT_BEAT, TRANSPORT_READY_TO_PLAY } from './action-types';


export function transportReadyToPlay(readyToPlay) {
   return { type: TRANSPORT_READY_TO_PLAY, readyToPlay: readyToPlay };
}


export function transportCurrentBeat(beatNumber) {
   return { type: TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}
