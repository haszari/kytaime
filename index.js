import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './src/www/store/store';

import ThrowdownApp from './src/www/components/throwdown-app';
import MidiLoopPlayer from './src/www/components/midi-loop-player';
import SampleSlicePlayer from './src/www/components/sample-slice-player';

import TempoDrop from './src/www/components/tempo-drop/component.jsx';


/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();


/// -----------------------------------------------------------------------------------------------
// hard-coded test data

// throwdownApp.push( new BasslinePlayer() );
throwdownApp.push( new MidiLoopPlayer( {
  pattern: {
   "duration": 16,
   "notes": [
    {
     "note": 70,
     "velocity": 100,
     "duration": 0.25,
     "start": 0
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 0.75
    },
    {
     "note": 66,
     "velocity": 100,
     "duration": 0.25,
     "start": 1.5
    },
    {
     "note": 65,
     "velocity": 100,
     "duration": 0.25,
     "start": 2
    },
    {
     "note": 28,
     "velocity": 100,
     "duration": 3,
     "start": 3
    },
    {
     "note": 60,
     "velocity": 100,
     "duration": 0.25,
     "start": 4
    },
    {
     "note": 65,
     "velocity": 100,
     "duration": 0.25,
     "start": 4
    },
    {
     "note": 60,
     "velocity": 100,
     "duration": 0.25,
     "start": 4.75
    },
    {
     "note": 66,
     "velocity": 100,
     "duration": 0.25,
     "start": 4.75
    },
    {
     "note": 56,
     "velocity": 100,
     "duration": 0.25,
     "start": 5.5
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 5.5
    },
    {
     "note": 56,
     "velocity": 100,
     "duration": 0.25,
     "start": 6
    },
    {
     "note": 24,
     "velocity": 100,
     "duration": 1,
     "start": 6
    },
    {
     "note": 70,
     "velocity": 100,
     "duration": 0.25,
     "start": 6
    },
    {
     "note": 70,
     "velocity": 67,
     "duration": 0.25,
     "start": 6.5
    },
    {
     "note": 70,
     "velocity": 69,
     "duration": 0.25,
     "start": 6.75
    },
    {
     "note": 56,
     "velocity": 100,
     "duration": 0.25,
     "start": 7
    },
    {
     "note": 70,
     "velocity": 100,
     "duration": 0.25,
     "start": 7
    },
    {
     "note": 70,
     "velocity": 46,
     "duration": 0.25,
     "start": 7.5
    },
    {
     "note": 70,
     "velocity": 58,
     "duration": 0.25,
     "start": 7.75
    },
    {
     "note": 70,
     "velocity": 100,
     "duration": 0.25,
     "start": 8
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 8.75
    },
    {
     "note": 48,
     "velocity": 100,
     "duration": 1,
     "start": 9
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 9.5
    },
    {
     "note": 65,
     "velocity": 100,
     "duration": 0.25,
     "start": 10
    },
    {
     "note": 24,
     "velocity": 100,
     "duration": 3,
     "start": 10
    },
    {
     "note": 60,
     "velocity": 100,
     "duration": 0.25,
     "start": 12
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 12
    },
    {
     "note": 60,
     "velocity": 100,
     "duration": 0.25,
     "start": 12.75
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 12.75
    },
    {
     "note": 56,
     "velocity": 100,
     "duration": 0.25,
     "start": 13.5
    },
    {
     "note": 68,
     "velocity": 100,
     "duration": 0.25,
     "start": 13.5
    },
    {
     "note": 56,
     "velocity": 100,
     "duration": 0.25,
     "start": 14
    },
    {
     "note": 76,
     "velocity": 100,
     "duration": 0.25,
     "start": 14
    },
    {
     "note": 76,
     "velocity": 67,
     "duration": 0.25,
     "start": 14.5
    },
    {
     "note": 76,
     "velocity": 69,
     "duration": 0.25,
     "start": 14.75
    },
    {
     "note": 56,
     "velocity": 100,
     "duration": 0.25,
     "start": 15
    },
    {
     "note": 76,
     "velocity": 100,
     "duration": 0.25,
     "start": 15
    },
    {
     "note": 34,
     "velocity": 100,
     "duration": 1,
     "start": 15
    },
    {
     "note": 75,
     "velocity": 46,
     "duration": 0.25,
     "start": 15.5
    },
    {
     "note": 70,
     "velocity": 58,
     "duration": 0.25,
     "start": 15.75
    }
   ]
  } 
} ) );
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-step-alpine.m4a',
    tempoBpm: 132, 
    sampleDuration: 4,
  } )
);
// throwdownApp.push(
//   new SampleSlicePlayer( {
//     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-alpine.m4a',
//     tempoBpm: 132, 
//     sampleDuration: 4,
//   } )
// );
// throwdownApp.push(
//   new SampleSlicePlayer( {
//     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-sub-ridge2.mp3',
//     tempoBpm: 132, 
//     sampleDuration: 4,
//   } )
// );
// throwdownApp.push(
//   new SampleSlicePlayer( {
//     audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-lead-uplands.m4a',
//     tempoBpm: 132, 
//     sampleDuration: 16,
//   } )
// );
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-voc-hills.m4a',
    tempoBpm: 132, 
    sampleDuration: 32,
  } )
);

throwdownApp.toggleTransport();

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

// hook up transport tempo, beat sample player to state
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

// hook up transport next tempo to state
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
      <TempoDrop />
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

