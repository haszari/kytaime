
import _ from 'lodash';

import renderNotePattern from '@kytaime/render-note-pattern';
import midiUtilities from '@kytaime/midi-utilities';

class MidiLoopPlayer {
  constructor(props) {
    this.props = _.defaults( props, MidiLoopPlayer.defaultProps );
    this.throwdownRender = this.throwdownRender.bind(this);
  }

  getNotePattern() {
    // convert any named drum hits into general midi
    const notes = this.props.notes.map( noteEvent => {
      if ( midiUtilities.drumMap[ noteEvent.note ] ) {
        return {
          ...noteEvent,
          note: midiUtilities.drumMap[ noteEvent.note ], 
        };
      }
      return noteEvent;
    } );

    return {
      notes: notes,
      duration: this.props.duration,
      startBeats: this.props.startBeats,
      endBeats: this.props.endBeats,
    }
  }

  throwdownRender( renderMsec, tempoBpm, renderBeats, midiOutPort ) {
    const currentPhraseLength = this.props.pattern.duration;
    const channel = this.props.channel;
    // let { triggered, playing } = this.state;
    var triggered = true;
    var playing = true;

    renderNotePattern( 
      renderMsec.start, 
      tempoBpm, 
      renderBeats,
      currentPhraseLength,
      midiOutPort, 
      this.getNotePattern(), // {notes, duration, startBeats, endBeats }
      channel, 
      triggered, 
      playing
    );
  }
}

MidiLoopPlayer.defaultProps = {
  midiChannel: 0,
  pattern: [],
};


export default MidiLoopPlayer;