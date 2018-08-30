import _ from 'lodash';

import update from 'immutability-helper';


import * as actionTypes from './action-types';


// refactor to util lib
// function tidySlug(desiredSlug, existingSlugs) {
//   let uniqueSlug = slugify(desiredSlug);
//   while (_.includes(existingSlugs, uniqueSlug))
//     uniqueSlug += _.sample('123456789');
//   return uniqueSlug;
// }

//---------------------------------------------
// defaults / schema for various data types

const defaults = {
  part: {
    slug: '',
    triggered: true, 
    playing: false, 
    // audio { file, tempo }, pattern { duration, slices }
    // or midi pattern data
  },
  section: {
    id: 0,
    slug: '',
    repeat: 0, // 0 = loop forever, otherwise is number of full duration repeats before auto-trigger next (phrase/longest pattern)
    renderPosition: null,
    onsetBeat: null,
    playbackBeats: 0,
    triggered: false,
    playing: false,
    parts: [], 
  }
}

//---------------------------------------------
// Parts - patterns or stems (loops) within a section


const partReducer = ( state = {}, action ) => {
  switch ( action.type ) {
    case actionTypes.THROWDOWN_ADD_SECTION: {
      // normalise - add missing fields
      const dang =  {
        ...defaults.part,
        ...state,
      };
      return dang;
    }
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: {
      return {
        ...state,
        triggered: action.triggered,
      }
    }
    case actionTypes.THROWDOWN_SET_PART_PLAYING: {
      return {
        ...state,
        playing: action.playing,
      }
    }
  }
  return state;
}

const partsReducer = ( state = [], action ) => {
  switch ( action.type ) {
    case actionTypes.THROWDOWN_ADD_SECTION: {
      return state.map( ( part ) => {
        return partReducer(part, action);
      })
    }
    case actionTypes.THROWDOWN_SET_PART_PLAYING: 
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: {
      return state.map( ( part ) => {
        if (part.slug == action.partSlug)
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


const sectionReducer = (state = defaults.section, action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_ADD_SECTION: {
      // const data = { data: action.data };
      return {
        ...state,
        id: nextSectionId(),
        slug: action.slug,
        repeat: action.repeat,
        // run parts through the reducer to normalise and add missing fields
        parts: partsReducer( action.parts, action ), 
      }
    }
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: {
      return {
        ...state,
        renderPosition: action.time,
        playbackBeats: action.playbackBeats,
      }      
    }
    case actionTypes.THROWDOWN_SET_SECTION_ONSET_BEAT: {
      return {
        ...state,
        onsetBeat: action.onsetBeat,
      }      
    }


    case actionTypes.THROWDOWN_SET_SECTION_PLAYING: {
      return Object.assign({}, state, {
        playing: action.playing,
      });
    }
    case actionTypes.THROWDOWN_SET_SECTION_TRIGGERED: {
      // solo triggered section (across deck)
      const triggered = state.id === action.sectionId ? action.triggered : false;
      return Object.assign({}, state, {
        triggered: triggered,
      });
    }

    case actionTypes.THROWDOWN_SET_PART_PLAYING: 
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

    case actionTypes.THROWDOWN_SET_SECTION_TRIGGERED: {
      // only allow one section toggled within a deck (solo)
      // so we call through to reducer for all sections here
      return state.map((section) => {
        return sectionReducer(section, action);
      })
    }

    case actionTypes.THROWDOWN_SET_SECTION_PLAYING: 
    case actionTypes.THROWDOWN_SET_PART_PLAYING: 
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: 
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: 
    case actionTypes.THROWDOWN_SET_SECTION_ONSET_BEAT: {
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
  sections: [],
}, action) => {
  switch (action.type) {
    case actionTypes.THROWDOWN_SET_SECTION_PLAYING: 
    case actionTypes.THROWDOWN_SET_SECTION_TRIGGERED:
    case actionTypes.THROWDOWN_SET_PART_PLAYING: 
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: 
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: 
    case actionTypes.THROWDOWN_SET_SECTION_ONSET_BEAT: 
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
    case actionTypes.THROWDOWN_SET_PART_PLAYING: 
    case actionTypes.THROWDOWN_SET_PART_TRIGGERED: 
    case actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION: 
    case actionTypes.THROWDOWN_SET_SECTION_ONSET_BEAT:
    case actionTypes.THROWDOWN_SET_SECTION_TRIGGERED: 
    case actionTypes.THROWDOWN_SET_SECTION_PLAYING:
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