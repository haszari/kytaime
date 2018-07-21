
import _ from 'lodash';

import * as actionTypes from './action-types';


export function transportTogglePlay() {
  return { type: actionTypes.TRANSPORT_TOGGLE_PLAY };
}

export function transportPlayState(playState) {
  return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}

export function transportRenderUpdate(renderRange) {
  return { type: actionTypes.TRANSPORT_RENDER_UPDATE, renderRange: renderRange };
}


export function toggleTestPatternPlayState(actionParams) {
	return { type: actionTypes.TOGGLE_TEST_PATTERN_PLAY_STATE };
}