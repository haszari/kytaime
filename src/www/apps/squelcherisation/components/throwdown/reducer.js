import _ from 'lodash';

import { default as slugify } from 'slug';

import update from 'immutability-helper';


import * as actionTypes from './action-types';


// refactor to util lib
function tidySlug(desiredSlug, existingSlugs) {
  let uniqueSlug = slugify(desiredSlug);
  while (_.includes(existingSlugs, uniqueSlug))
    uniqueSlug += _.sample('123456789');
  return uniqueSlug;
}

function snipStemsReducer(state = {
  // object map of slug: { 
  //   audio: audio file info (optional)
  //   data: midi note/audio event data, 
  //   renderPosition: most recent render msec 
  //   trigger: trigger state boolean
  // }
}, action) {
  switch (action.type) {

    case actionTypes.THROWDOWN_ADD_SNIP_STEM: {
      const slug = tidySlug(action.slug, _.keys(state));
      const stem = { [slug]: { 
        audio: action.audio, 
        pattern: action.pattern,
        trigger: false,
      } };
      return { ...state, ...stem };
    }

    case actionTypes.THROWDOWN_UPDATE_SNIP_STEM_RENDER_POSITION:
      return update(state, {
        [action.slug]: {
          renderPosition: { $set: action.time }
        }
      });

    case actionTypes.THROWDOWN_TOGGLE_SNIP_STEM_TRIGGER:
      return update(state, {
        [action.slug]: {
          trigger: { $apply: (trigger) => !trigger }
        }
      });

    case actionTypes.THROWDOWN_REMOVE_SNIP_STEM:
      return _.omit(state, action.slug);

  }
  return state;

}

// a reducer for a dictionary of snips - song part loops, e.g. bass 1, intro beat etc
// we will use something like this later in throwdown.section
const snipCollectionReducer = (state = { 
  // object map of slug: { snip data }
}, action) => {
  switch (action.type) {

    case actionTypes.THROWDOWN_ADD_SNIP: 
    {
      const slug = tidySlug(action.slug, _.keys(state));
      const newSnip = { [slug]: { stems: {} } };
      return { ...state, ...newSnip };
    }

    case actionTypes.THROWDOWN_REMOVE_SNIP:
      return _.omit(state, action.slug);

    case actionTypes.THROWDOWN_RENAME_SNIP: 
    {
      let newState = _.omit(state, action.slug);
      const newSnip = { [action.newSlug]: state[action.slug] };
      return { ...newState, ...newSnip };
    }

    case actionTypes.THROWDOWN_ADD_SNIP_STEM:
    case actionTypes.THROWDOWN_REMOVE_SNIP_STEM: 
    case actionTypes.THROWDOWN_UPDATE_SNIP_STEM_RENDER_POSITION: 
    case actionTypes.THROWDOWN_TOGGLE_SNIP_STEM_TRIGGER:
    {
      let newState = _.omit(state, action.snip);
      const newSnip = { [action.snip]: { stems: snipStemsReducer(state[action.snip].stems, action) } };
      return { ...newState, ...newSnip };
    }
  }
  return state;
}








//---------------------------------------------
// Deck sections


const nextSectionId = () => { 
  if( typeof nextSectionId.defaultId == 'undefined' ) {
    nextSectionId.defaultId = 0;
  }  
  return nextSectionId.defaultId++;
}

const sectionReducer = (state = {
  id: nextSectionId(),
  parts: [],
}, action) => {
  switch (action.type) {
  }
  return state;
}

const sectionsReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_ADD_SECTION: {
      return [
        ...state,
        sectionReducer(undefined, action)
      ];
    }

    case actionTypes.THROWDOWN_REMOVE_SECTION: {
      return state.filter(section => section.id !== action.sectionId);
    }
  }
  return state;
}


//---------------------------------------------
// Decks

const nextDeckId = () => { 
  if( typeof nextDeckId.defaultId == 'undefined' ) {
    nextDeckId.defaultId = 0;
  }  
  return nextDeckId.defaultId++;
}

const deckReducer = (state = {
  id: nextDeckId(),
  triggeredSectionId: null,
  sections: [],
}, action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_SET_TRIGGERED_SECTION: {
      return Object.assign({}, state, {
        triggeredSectionId: action.sectionId,
      });
    }
    case actionTypes.THROWDOWN_ADD_SECTION: 
    case actionTypes.THROWDOWN_REMOVE_SECTION: {
      return Object.assign({}, state, {
        sections: sectionsReducer(state.sections, action),
      });
    }
  }
  return state;
}

// Throwdown lines reducer
// Is an array of lines, which are like DJ decks for throwdown stem stuff
// This reducer handles add/remove, linereducer handles editing of each deck/line
const decksReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_SET_TRIGGERED_SECTION: 
    case actionTypes.THROWDOWN_ADD_SECTION: 
    case actionTypes.THROWDOWN_REMOVE_SECTION: {
      return state.map((deck) => {
        if (deck.id == action.deckId)
          return deckReducer(deck, action);
        return deck;
      })
    }

    case actionTypes.THROWDOWN_ADD_DECK: {
      return [
        ...state,
        deckReducer(undefined, action)
      ];
    }

    case actionTypes.THROWDOWN_REMOVE_DECK: {
      return state.filter(deck => deck.id !== action.deckId);
    }
  }
  return state;
}


//---------------------------------------------
// Throwdown - app


// Throwdown app reducer
// contains a collection of throwdown decks
// each line contains a bunch of song un-editable sections that it can walk through
// this guy pretty much delegates to other reducers
const throwdownReducer = (state = { 
  decks: [],
}, action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_SET_TRIGGERED_SECTION:
    case actionTypes.THROWDOWN_ADD_SECTION: 
    case actionTypes.THROWDOWN_REMOVE_SECTION: 
    case actionTypes.THROWDOWN_ADD_DECK: 
    case actionTypes.THROWDOWN_REMOVE_DECK: {
      return Object.assign({}, state, {
        decks: decksReducer(state.decks, action),
      });
    }
  }
  return state;
}

export default throwdownReducer;