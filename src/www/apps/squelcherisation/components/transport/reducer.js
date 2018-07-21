
import * as actionTypes from './action-types';

const transport = (state = { 
  playState: '', 

  // redundancy .. I should use a selector to get these out of renderRange
  beat: 0,
  time: 0,

  renderRange: {},

  // more transport state coming soon..
  // tempo: 122,

  // this like a built-in metronome
  triggerTestMidi: false,
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
        renderRange: action.renderRange
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