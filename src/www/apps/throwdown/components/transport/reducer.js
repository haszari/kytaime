
import * as actionTypes from './action-types';

const transport = (state = { 
  playState: '', 
  beatNumber: 0,
  /// generalness coming sooon
  // triggerAudio: false, 
  triggerTestMidi: true,
}, action) => {
  switch (action.type) {
    case actionTypes.TRANSPORT_TOGGLE_PLAY:
      var playState = ( state.playState === "playing" ) ? "stopped" : "playing";
      return Object.assign({}, state, {
        playState: playState
      });

    case actionTypes.TRANSPORT_PLAYSTATE: 
      let beatNumber = (action.playState == "stopped") ? 0 : state.beatNumber;
      return Object.assign({}, state, {
        playState: action.playState,
        beatNumber: beatNumber
      });
    case actionTypes.TRANSPORT_CURRENT_BEAT: 
      return Object.assign({}, state, {
        beatNumber: action.beatNumber
      });

    case actionTypes.TOGGLE_TEST_PATTERN_PLAY_STATE: 
        return Object.assign({}, state, {
          triggerTestMidi: !state.triggerTestMidi
        });            

    default:
      return state;
  }
}

export default transport;