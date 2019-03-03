import { createAction } from 'redux-starter-kit';

// shared infrastructure
const setAudioContext = createAction( 'throwdown/setAudioContext' );
const addAudioBuffer = createAction( 'throwdown/addAudioBuffer' );

// song data
const addPattern = createAction( 'throwdown/addPattern' );
const addSection = createAction( 'throwdown/addSection' );

// deck state
const setDeckTriggeredSection = createAction( 'throwdown/setDeckTriggeredSection' );
const setDeckPlayingSection = createAction( 'throwdown/setDeckPlayingSection' );

export default {
  setAudioContext,
  addAudioBuffer,

  addPattern,
  addSection,

  setDeckTriggeredSection,
  setDeckPlayingSection,
};