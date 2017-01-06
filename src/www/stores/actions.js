


import * as actionTypes from './action-types';

export function transportPlayState(playState) {
   return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}

export function transportCurrentBeat(beatNumber) {
   return { type: actionTypes.TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}

export function addPattern(pattern) {
   return { type: actionTypes.ADD_PATTERN, id: pattern.id, channel: pattern.channel };
}

export function togglePatternTrigger(pattern) {
   return { type: actionTypes.TOGGLE_PATTERN_TRIGGER, id: pattern.id };
}

export function patternPlayState(pattern) {
   return { type: actionTypes.PATTERN_PLAYSTATE, id: pattern.id, playing: pattern.playing };
}

