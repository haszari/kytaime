import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const throwdownReducer = createReducer( {
  patterns: [],
  sections: [],
}, {
  [ actions.addPattern ]: ( state, action ) => {
    var patternData = {
      slug: action.payload.slug,

      channel: action.payload.channel, 
      duration: action.payload.duration, 
      startBeats: action.payload.startBeats, 
      endBeats: action.payload.endBeats, 
      
      notes: action.payload.notes, 
      // slices: action.payload.notes, 
      
      audioFile: action.payload.file, 
      tempoBpm: action.payload.tempo, 
    };
    state.patterns.push( patternData );
  },
  [ actions.addSection ]: ( state, action ) => {
    state.sections.push( {
      slug: action.payload.slug,

      duration: action.payload.bars * 4,
      
      patterns: action.payload.patterns,
    } );
  }
} );

export default throwdownReducer;