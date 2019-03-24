import { createAction } from 'redux-starter-kit';

// shared infrastructure
const setAudioContext = createAction( 'throwdown/setAudioContext' );
const addAudioBuffer = createAction( 'throwdown/addAudioBuffer' );

// "drop" infrastructure, kinda transportish
const setDeferAllTriggers = createAction( 'throwdown/setDeferAllTriggers' );
const toggleDeferAllTriggers = createAction( 'throwdown/toggleDeferAllTriggers' );

// song data
const addPattern = createAction( 'throwdown/addPattern' );

// deck state
const addDeck = createAction( 'throwdown/addDeck' );
const addSection = createAction( 'throwdown/addSection' );
const setDeckTriggeredSection = createAction( 'throwdown/setDeckTriggeredSection' );
const setDeckPlayingSection = createAction( 'throwdown/setDeckPlayingSection' );
const toggleDeckTriggeredSection = createAction( 'throwdown/toggleDeckTriggeredSection' );

export default {
  setAudioContext,
  addAudioBuffer,

  setDeferAllTriggers,
  toggleDeferAllTriggers,

  addPattern,

  addDeck,
  addSection,
  setDeckTriggeredSection,
  setDeckPlayingSection,
  toggleDeckTriggeredSection,
};