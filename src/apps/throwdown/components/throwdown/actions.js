import { createAction } from 'redux-starter-kit';

// shared infrastructure
const setAudioContext = createAction( 'throwdown/setAudioContext' );
const addAudioBuffer = createAction( 'throwdown/addAudioBuffer' );

// "drop" infrastructure, kinda transportish
const setDeferAllTriggers = createAction( 'throwdown/setDeferAllTriggers' );
const toggleDeferAllTriggers = createAction( 'throwdown/toggleDeferAllTriggers' );

// song data
const addPattern = createAction( 'throwdown/addPattern' );
const addSection = createAction( 'throwdown/addSection' );

// deck state
const setDeckTriggeredSection = createAction( 'throwdown/setDeckTriggeredSection' );
const setDeckPlayingSection = createAction( 'throwdown/setDeckPlayingSection' );


export default {
  setAudioContext,
  addAudioBuffer,

  setDeferAllTriggers,
  toggleDeferAllTriggers,

  addPattern,
  addSection,

  setDeckTriggeredSection,
  setDeckPlayingSection,
};