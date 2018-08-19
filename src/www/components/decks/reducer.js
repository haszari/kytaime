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

//---------------------------------------------
// Parts - patterns or stems (loops) within a section

const partReducer = (state = {}, action) => {
  
}

const partsReducer = ( state = [], action ) => {
  switch ( action.type ) {
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: {
      return state.map( ( part ) => {
        if (part.id == action.partId)
          return partReducer(part, action);
        return part;
      })
    }
  }
  return state;
}

//---------------------------------------------
// Sections - frozen chunks of arrangement (in a deck ready for playback)


const nextSectionId = () => { 
  if( typeof nextSectionId.defaultId == 'undefined' ) {
    nextSectionId.defaultId = 0;
  }  
  return nextSectionId.defaultId++;
}

const sectionReducer = (state = {
  id: nextSectionId(),
  renderPosition: null,
  parts: [], 
}, action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_ADD_SECTION: {
      // const data = { data: action.data };
      return {
        ...state,
        parts: action.parts,
      }
    }
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: {
      return {
        ...state,
        renderPosition: action.time,
      }      
    }
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: {
      return {
        ...state,
        parts: partsReducer( state.parts, action ),
      }
    }
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

    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: 
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: {
      return state.map((section) => {
        if (section.id == action.sectionId)
          return sectionReducer(section, action);
        return section;
      })
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
  playingSectionId: null,
  sections: [],
}, action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_SET_PLAYING_SECTION: {
      return Object.assign({}, state, {
        playingSectionId: action.sectionId,
      });
    }
    case actionTypes.THROWDOWN_SET_TRIGGERED_SECTION: {
      return Object.assign({}, state, {
        triggeredSectionId: action.sectionId,
      });
    }

    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: 
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: 
    case actionTypes.THROWDOWN_ADD_SECTION: 
    case actionTypes.THROWDOWN_REMOVE_SECTION: {
      return Object.assign({}, state, {
        sections: sectionsReducer(state.sections, action),
      });
    }
  }
  return state;
}

// Decks reducer
// Is an array of decks, which are like DJ decks for throwdown stem stuff
// This reducer handles add/remove, linereducer handles editing of each deck/line
const decksReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: 
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: 
    case actionTypes.THROWDOWN_SET_TRIGGERED_SECTION: 
    case actionTypes.THROWDOWN_SET_PLAYING_SECTION:
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


export default decksReducer;