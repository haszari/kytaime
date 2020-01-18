import { createAction } from '@reduxjs/toolkit';

// "drop" infrastructure, kinda transportish
const setDeferAllTriggers = createAction( 'throwdown/setDeferAllTriggers' );
const toggleDeferAllTriggers = createAction( 'throwdown/toggleDeferAllTriggers' );

// song data
const addPattern = createAction( 'throwdown/addPattern' );

// song + pattern state (song == deck for now)
const setDeckPatternPlaystate = createAction( 'throwdown/setDeckPatternPlaystate' );

// deck state
const addDeck = createAction( 'throwdown/addDeck' );
const addSection = createAction( 'throwdown/addSection' );
const setDeckTriggeredSection = createAction( 'throwdown/setDeckTriggeredSection' );
const setDeckPlayingSection = createAction( 'throwdown/setDeckPlayingSection' );
const toggleDeckTriggeredSection = createAction( 'throwdown/toggleDeckTriggeredSection' );

// section + part state
const setDeckSectionPartTriggeredPattern = createAction( 'throwdown/setDeckSectionPartTriggeredPattern' );

export default {
  setDeferAllTriggers,
  toggleDeferAllTriggers,

  addPattern,

  addDeck,
  addSection,
  setDeckTriggeredSection,
  setDeckPlayingSection,
  toggleDeckTriggeredSection,

  setDeckPatternPlaystate,

  setDeckSectionPartTriggeredPattern,
};
