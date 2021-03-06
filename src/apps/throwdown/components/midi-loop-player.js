
import _ from 'lodash';

import bpmUtilities from '@kytaime/sequencer/bpm-utilities';
import midiUtilities from '@kytaime/midi-utilities';
import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

class MidiLoopPlayer {
  constructor( props ) {
    this.updateProps( props );

    this.triggered = false;
    this.playing = false;
    this.parentTriggered = false;
    this.parentPhraseLength = 4;
  }

  updateProps( props ) {
    this.props = _.defaults( props, MidiLoopPlayer.defaultProps );
  }

  setTriggered( triggered ) {
    this.triggered = triggered;
  }

  setParentTriggered( triggered ) {
    this.parentTriggered = triggered;
  }

  setParentPhrase( parentPhraseLength ) {
    this.parentPhraseLength = parentPhraseLength;
  }

  setPlaying( playing ) {
    this.playing = playing;
  }

  getNotePattern() {
    // convert any named drum hits into general midi
    const notes = this.props.notes.map( noteEvent => {
      if ( midiUtilities.drumMap[noteEvent.note] ) {
        return {
          ...noteEvent,
          note: midiUtilities.drumMap[noteEvent.note],
        };
      }
      return noteEvent;
    } );

    return {
      notes: notes,
      duration: this.props.duration,
      startBeats: this.props.startBeats,
      endBeats: this.props.endBeats,
    };
  }

  stopPlayback() {
    // we just let the current notes die
    this.playing = false;
  }

  throwdownRender( renderMsec, tempoBpm, renderBeats, midiOutPort ) {
    // const currentPhraseLength = this.props.pattern.duration;
    const channel = this.props.channel;
    const patternDuration = this.props.duration;

    // let { triggered, playing } = this.state;
    var triggered = this.triggered && this.parentTriggered;

    const triggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm,
      renderBeats,
      triggered,
      this.playing,
      this.parentPhraseLength,
      this.props.startBeats,
      this.props.endBeats
    );
    this.playing = triggerInfo.isPlaying;

    const pattern = this.getNotePattern();

    const filteredNotes = _.filter( pattern.notes, function( event ) {
      return bpmUtilities.valueInWrappedBeatRange(
        event.start,
        triggerInfo.startBeat % patternDuration,
        triggerInfo.endBeat % patternDuration,
        patternDuration
      );
    } );

    var renderStartMsec = renderMsec.start;

    var renderStart = ( renderBeats.start % patternDuration );
    var renderEnd = ( renderBeats.end % patternDuration );

    _.each( filteredNotes, _.partial( function( noteEvent, patternDuration, channel ) {
      var beatOffset = noteEvent.start - renderStart;

      // account for crossing loop boundary
      if ( ( renderEnd < renderStart ) && ( noteEvent.start < renderStart ) ) {
        beatOffset += patternDuration;
      }

      var timestamp = bpmUtilities.beatsToMs( tempoBpm, beatOffset );

      var note = {
        port: midiOutPort,

        channel: channel,
        note: noteEvent.note,

        velocity: noteEvent.velocity,
        duration: bpmUtilities.beatsToMs( tempoBpm, noteEvent.duration ),
        timestamp: renderStartMsec + timestamp,
      };
      // console.log(note.timestamp);

      midiUtilities.renderNote( note, renderMsec.midiEventOffset );
    }, _, patternDuration, channel ) );
  }
}

MidiLoopPlayer.defaultProps = {
  midiChannel: 0,
  duration: 4,
  notes: [],
};

export default MidiLoopPlayer;
