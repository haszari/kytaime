


import * as actionTypes from './action-types';

export function transportPlayState(playState) {
   return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}

export function transportCurrentBeat(beatNumber) {
   return { type: actionTypes.TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}

let nextPatternId = 1;
export function addPattern({channel, notes, duration, startBeats, endBeats}) {
   return { 
      type: actionTypes.ADD_PATTERN, 
      id: nextPatternId++, 
      channel: channel,
      notes: notes,
      duration: duration,
      startBeats: startBeats,
      endBeats: endBeats
   };
}

export function togglePatternTrigger(pattern) {
   return { type: actionTypes.TOGGLE_PATTERN_TRIGGER, id: pattern.id };
}

export function patternPlayState(pattern) {
   return { type: actionTypes.PATTERN_PLAYSTATE, id: pattern.id, playing: pattern.playing };
}

