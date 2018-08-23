
import _ from 'lodash';

// import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as midiUtilities from '@kytaime/lib/sequencer/midi-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';


class MidiPatternPlayer {
  constructor(props) {
    this.slug = props.slug;

    this.part = props.part || "drums";
    
    this.secPerBeat = (60 / this.tempo);

    this.triggered = true;
    this.playing = false;

    this.startBeats = props.startBeats || [0];
    this.endBeats = props.endBeats || [0];

    this.notes = props.notes;
    this.duration = props.duration;

    this.midiChannel = midiUtilities.getZeroChannelForPart(this.part);

    this.updatePlayingState = props.updatePlayingState;
  }

  stop() {
    // we can't; we don't, and we won't 
  }

  updateAndRenderAudio(renderRange, triggerState, playingState, audioDestinationNode) {
    const { duration, midiChannel } = this;

    const beatsPerMinute = renderRange.tempoBpm;

    this.triggered = triggerState;
    this.playing = playingState;

    const triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      this.triggered,
      this.playing, 
      duration,
      this.startBeats,
      this.endBeats,
    );

    this.playing = triggerInfo.isPlaying;
    this.updatePlayingState( this.playing );

    const filteredNotes = _.filter(this.notes, function(event) {
      return bpmUtilities.valueInWrappedBeatRange(
        event.start, 
        triggerInfo.startBeat % duration, 
        triggerInfo.endBeat % duration, 
        duration
      );
    });

    // start and end of render range in pattern-beats
    const renderStart = (renderRange.start.beat % duration);
    const renderEnd = (renderRange.end.beat % duration);

    _.map(filteredNotes, (noteEvent) => {
      let beatOffset = noteEvent.start - renderStart;

      // account for crossing loop boundary
      if ((renderEnd < renderStart) && (noteEvent.start < renderStart)) {
        beatOffset += duration;
      }

      const timestamp = bpmUtilities.beatsToMs(beatsPerMinute, beatOffset);
      const note = { 
        port: renderRange.midiOutPort, 

        channel: midiChannel,
        note: noteEvent.note || 60,

        velocity: noteEvent.velocity || 100, 
        duration: bpmUtilities.beatsToMs(beatsPerMinute, noteEvent.duration), 
        timestamp: renderRange.start.time + timestamp
      };

      midiUtilities.renderNote(note);    
    });
  }
}

export default MidiPatternPlayer;