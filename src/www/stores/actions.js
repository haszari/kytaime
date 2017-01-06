


import * as actionTypes from './action-types';

export function transportPlayState(playState) {
   return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}

export function transportCurrentBeat(beatNumber) {
   return { type: actionTypes.TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}

let nextPatternId = 0;
export function addPattern() {
   return { type: actionTypes.ADD_PATTERN, id: nextPatternId++ };
}

export function togglePatternTrigger(pattern) {
   return { type: actionTypes.TOGGLE_PATTERN_TRIGGER, id: pattern.id };
}

export function patternPlayState(pattern) {
   return { type: actionTypes.PATTERN_PLAYSTATE, id: pattern.id, playing: pattern.playing };
}

