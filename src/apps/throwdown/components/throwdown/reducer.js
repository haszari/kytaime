import { createReducer } from 'redux-starter-kit';

import actions from './actions';

// import audioUtilities from '@kytaime/audio-utilities';

const throwdownReducer = createReducer( {
  audioContext: null, 
  buffers: [],
  
  patterns: [],
  sections: [],

  // one hard-coded deck for now – will be an array of decks later
  deck: {
    triggeredSection: null,
    playingSection: null, 
  },
}, {
  [ actions.setAudioContext ]: ( state, action ) => {
    state.audioContext = action.payload;
  },
  [ actions.addAudioBuffer ]: ( state, action ) => {
    state.buffers.push( {
      file: action.payload.file,
      buffer: action.payload.buffer,
    } );
  },

  // song state
  [ actions.addPattern ]: ( state, action ) => {
    // var patternData = {
    //   slug: action.payload.slug,

    //   channel: action.payload.channel, 
    //   duration: action.payload.duration, 
    //   startBeats: action.payload.startBeats, 
    //   endBeats: action.payload.endBeats, 
      
    //   notes: action.payload.notes, 
    //   // slices: action.payload.notes, 
      
    //   audioFile: action.payload.file, 
    //   tempoBpm: action.payload.tempo, 
    // };
    const patternData = action.payload;
    state.patterns.push( patternData );

    // if ( patternData.file && ! _.find( state.buffers, { slug: patternData.file } ) ) {
    //   // ensureAudioBuffered( state.audioContext, patternData.file )
    //   audioUtilities.loadSample( patternData.file, state.audioContext, ( buffer ) => {
    //     console.log( `sample decoded, ready to play ${ patternData.file }` );
    //     // maybe we should just dispatch addAudioBuffer here?
    //     state.buffers.push( {
    //       file: patternData.file,
    //       buffer: buffer,
    //     } );
    //   } );
    // }
  },
  [ actions.addSection ]: ( state, action ) => {
    state.sections.push( {
      slug: action.payload.slug,

      duration: action.payload.bars * 4,
      
      patterns: action.payload.patterns,
    } );
  },

  // sequencer/playback state
  [ actions.setDeckTriggeredSection ]: ( state, action ) => {
    // pass no slug to clear triggered section
    state.deck.triggeredSection = action.payload.sectionSlug;
  },
  [ actions.setDeckPlayingSection ]: ( state, action ) => {
    // pass no slug to clear triggered section
    state.deck.playingSection = action.payload.sectionSlug;
  },

} );

export default throwdownReducer;