import React from 'react';
import { render } from 'react-dom';

import importMidiFile from '@kytaime/import-midi-file';

class MidiImporterApp extends React.Component {
  constructor( props ) {
    super( props );

    this.importFile = this.importFile.bind( this );
    this.offsetChange = this.offsetChange.bind( this );

    this.state = {
      midiPatternData: undefined,
      beatOffset: 0,
      filename: '',
    };
  }

  offsetChange( event ) {
    this.setState( {
      beatOffset: parseInt( event.currentTarget.value ),
    } );
  }

  importFile( event ) {
    var reader = new FileReader();
    const setState = this.setState.bind( this );
    const offset = this.state.beatOffset;
    const filename = event.currentTarget.files[0].name;
    reader.onload = function() {
      const patternData = importMidiFile( this.result, offset );
      setState( {
        midiPatternData: patternData,
        filename: filename,
      } );
    };
    reader.readAsArrayBuffer( event.currentTarget.files[0] );
    event.currentTarget.value = '';
  }

  render() {
    return (
      <div>
        Subtract beats: <input type="number" step='1' value={ this.state.beatOffset } onChange={ this.offsetChange } />
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
        <h2>{ this.state.filename }</h2>
        <textarea
          rows="40"
          readOnly
          style={{ width: '100%' }}
          value={ this.state.midiPatternData ? JSON.stringify( this.state.midiPatternData, null, '  ' ) : '' }
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
  document.getElementById( 'app' )
);
