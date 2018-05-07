
import _ from 'lodash';

import shortid from 'shortid';

import * as actionTypes from './action-types';




export function transportTogglePlay() {
   return { type: actionTypes.TRANSPORT_TOGGLE_PLAY };
}

export function transportPlayState(playState) {
   return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}
