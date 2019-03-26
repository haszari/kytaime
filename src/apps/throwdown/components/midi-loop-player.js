
import _ from 'lodash';

import renderNotePattern from '@kytaime/render-note-pattern';
import midiUtilities from '@kytaime/midi-utilities';
import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

class MidiLoopPlayer {
  constructor(props) {
    this.updateProps( props );
  
    this.playing = false;
    this.parentTriggered = false;
    this.parentPhraseLength = 4;
    // this.throwdownRender = this.throwdownRender.bind(this);
  }

  updateProps( props ) {
    this.props = _.defaults( props, MidiLoopPlayer.defaultProps );
  }

  setParentTriggered( triggered ) {
    this.parentTriggered = triggered;
  }

  setParentPhrase( parentPhraseLength ) {
    this.parentPhraseLength = parentPhraseLength;
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

  stopPlayback() {
    // we just let the current notes die
  }

  throwdownRender( renderMsec, tempoBpm, renderBeats, midiOutPort ) {
    // const currentPhraseLength = this.props.pattern.duration;
    const channel = this.props.channel;
    // let { triggered, playing } = this.state;
    var triggered = true && this.parentTriggered;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm, 
      renderBeats,
      triggered,
      this.playing, 
      this.parentPhraseLength,
    );
    this.playing = triggerInfo.isPlaying;

    renderNotePattern( 
      renderMsec.start, 
      tempoBpm, 
      renderBeats,
      this.props.pattern.duration,
      midiOutPort, 
      this.getNotePattern(), // {notes, duration, startBeats, endBeats }
      channel, 
      triggered, 
      this.playing
    );
  }
}

MidiLoopPlayer.defaultProps = {
  midiChannel: 0,
  pattern: [],
};


export default MidiLoopPlayer;