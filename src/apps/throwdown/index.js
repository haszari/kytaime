import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import Hjson from 'hjson';

import store from './store/store';

import ThrowdownApp from './throwdown-app';

import MidiLoopPlayer from './components/midi-loop-player';
import SampleSlicePlayer from './components/sample-slice-player';

import PlayButton from './components/play-button.jsx';
import TempoDrop from './components/tempo-drop/component.jsx';


/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();


/// -----------------------------------------------------------------------------------------------
// hard-coded test data

const testSongFile = '/data/20190217--manas.hjson';
window.fetch( testSongFile )
  .then( response => response.text() )
  .then( text => {
    const songData = Hjson.parse( text );
    throwdownApp.loadData( songData );
    // console.log( songData );
  } );

// throwdownApp.push( new BasslinePlayer() );
// throwdownApp.push( new MidiLoopPlayer( {
//   pattern: {
//     "duration": 32,
//     "notes": [
//       {
//         "note": 28,
//         "velocity": 100,
//         "duration": 4,
//         "start": 0
//       },
//       {
//         "note": 28,
//         "velocity": 100,
//         "duration": 4,
//         "start": 8
//       },
//       {
//         "note": 28,
//         "velocity": 100,
//         "duration": 4,
//         "start": 16
//       },
//       {
//         "note": 24,
//         "velocity": 100,
//         "duration": 4,
//         "start": 24
//       },
//       {
//         "note": 34,
//         "velocity": 100,
//         "duration": 3,
//         "start": 28
//       },
//       {
//         "note": 35,
//         "velocity": 100,
//         "duration": 0.25,
//         "start": 31
//       },
//       {
//         "note": 37,
//         "velocity": 100,
//         "duration": 0.25,
//         "start": 31.25
//       },
//       {
//         "note": 41,
//         "velocity": 100,
//         "duration": 0.25,
//         "start": 31.5
//       },
//       {
//         "note": 46,
//         "velocity": 100,
//         "duration": 0.25,
//         "start": 31.75
//       }
//     ]
//   }
// } ) );
// throwdownApp.push(
//   new SampleSlicePlayer( {
//     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-step-alpine.m4a',
//     tempoBpm: 132, 
//     sampleDuration: 4,
//   } )
// );
// // throwdownApp.push(
// //   new SampleSlicePlayer( {
// //     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-alpine.m4a',
// //     tempoBpm: 132, 
// //     sampleDuration: 4,
// //   } )
// // );
// // throwdownApp.push(
// //   new SampleSlicePlayer( {
// //     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-sub-ridge2.mp3',
// //     tempoBpm: 132, 
// //     sampleDuration: 4,
// //   } )
// // );
// // throwdownApp.push(
// //   new SampleSlicePlayer( {
// //     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-lead-uplands.m4a',
// //     tempoBpm: 132, 
// //     sampleDuration: 16,
// //   } )
// // );
// throwdownApp.push(
//   new SampleSlicePlayer( {
//     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-voc-hills.m4a',
//     tempoBpm: 132, 
//     sampleDuration: 32,
//   } )
// );

// throwdownApp.toggleTransport();

/// -----------------------------------------------------------------------------------------------
// bind sequencer/transport to store

// (thanks to https://github.com/reduxjs/redux/issues/303#issuecomment-125184409)
// this should be moved into a lib folder
function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(
  store, 
  // transport component could provide this selector
  ( state ) => {
    return state.transport.isPlaying
  }, 
  ( isPlaying ) => {
    if ( isPlaying ) {
      throwdownApp.startTransport();
    }
    else {
      throwdownApp.stopTransport();
    }
  }
);

// hook up transport tempo to state
observeStore(
  store, 
  // transport component could provide this selector
  ( state ) => {
    return state.transport.tempo
  }, 
  ( tempo ) => {
    throwdownApp.setTempo( tempo )
  }
);
observeStore(
  store, 
  // transport component could provide this selector
  ( state ) => {
    return state.tempoDrop.nextTempo
  }, 
  ( nextTempo ) => {
    throwdownApp.setNextTempo( nextTempo )
  }
);

/// -----------------------------------------------------------------------------------------------
// app component

function App() {
  return (
    <Provider store={ store }>
      <h1>Bam</h1>
      <PlayButton />
      <TempoDrop />
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

