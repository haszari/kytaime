
import _ from 'lodash';

import * as actionTypes from './action-types';


export function transportTogglePlay() {
   return { type: actionTypes.TRANSPORT_TOGGLE_PLAY };
}

export function transportPlayState(playState) {
   return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}


export function toggleElementTriggerState(actionParams) {
	return { type: actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE, ...actionParams };
}