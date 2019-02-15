import React from 'react';
import { render } from 'react-dom';

import importMidiFile from '@kytaime/import-midi-file';

class MidiImporterApp extends React.Component {
  constructor( props ) {
    super( props );

    this.importFile = this.importFile.bind( this );

    this.state = {
      midiPatternData: undefined,
    }
  }

  importFile( event ) {
    var reader = new FileReader();
    const setState = this.setState.bind( this );
    reader.onload = function() {
      const patternData = importMidiFile( this.result );
      setState( {
        midiPatternData: patternData,
      } );
    }
    reader.readAsArrayBuffer( event.currentTarget.files[0] );
  }

  render() {
    return (
      <div>
        <input 
          type="file" 
          onChange={ this.importFile } 
          style={{
              width: '100%',
              height: '50px',
              fontSize: '1em',
              background: 'ghostwhite',
          }}
        />
        <br />
        <textarea 
          rows="40"
          readOnly 
          style={{ width: '100%' }}
          value={ this.state.midiPatternData ? JSON.stringify(this.state.midiPatternData, null, ' ') : '' }
        />
        <br />
      </div>
    );
  }

}

/// -----------------------------------------------------------------------------------------------
// page component

function App() {
  return (
    <div>
      <h1>Import a midi file</h1>
      <MidiImporterApp />
    </div>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

