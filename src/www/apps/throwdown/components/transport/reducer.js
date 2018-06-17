
import * as actionTypes from './action-types';

const transport = (state = { 
  playState: '', 
  beatNumber: 0,
  /// generalness coming sooon
  triggerAudio: false, 
  triggerMidi: true,
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

    case actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE: 
      if (action.element == 'MIDI') {
        return Object.assign({}, state, {
          triggerMidi: !state.triggerMidi
        });            
      }
    if (action.element == 'Audio') {
      return Object.assign({}, state, {
        triggerAudio: !state.triggerAudio
      });            
    }

    default:
      return state;
  }
}

export default transport;