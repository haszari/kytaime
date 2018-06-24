
import * as actionTypes from './action-types';

const transport = (state = { 
  playState: '', 
  beat: 0,
  time: 0,

  // more transport state coming soon..
  // tempo: 122,

  // this like a built-in metronome
  triggerTestMidi: true,
}, action) => {
  switch (action.type) {
    case actionTypes.TRANSPORT_TOGGLE_PLAY:
      var playState = ( state.playState === "playing" ) ? "stopped" : "playing";
      return Object.assign({}, state, {
        playState: playState
      });

    case actionTypes.TRANSPORT_PLAYSTATE: 
      let beatNumber = (action.playState == "stopped") ? 0 : state.beat;
      return Object.assign({}, state, {
        playState: action.playState,
        beat: beat
      });
    case actionTypes.TRANSPORT_RENDER_UPDATE:
      return Object.assign({}, state, {
        beat: action.renderRange.end.beat,
        time: action.renderRange.end.time,
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