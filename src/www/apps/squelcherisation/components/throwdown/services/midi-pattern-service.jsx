
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';


import store from '../../../stores/store';

import * as throwdownActions from '../actions';

// I should use an @alias for these?
import * as midiUtilities from '../../../../../lib/sequencer/midi-utilities';
import * as bpmUtilities from '../../../../../lib/sequencer/bpm-utilities';
import * as patternSequencer from '../../../../../lib/sequencer/pattern-sequencer';


// this routine is probably part of what we want from sequencer/bpm-utilities
function getTimeOffsetForBeat(eventBeat, renderStart, renderEnd, transportBpm, wrapBeats) {  
  let beatOffset = eventBeat - renderStart;
  if ((renderEnd < renderStart) && (eventBeat < renderStart)) {
      beatOffset += wrapBeats;
  }
  var offsetMs = bpmUtilities.beatsToMs(transportBpm, beatOffset);
  return offsetMs;
}


const mapStateToProps = (state, ownProps) => {
  return {
    transportPlayState: state.transport.playState,
    renderRange: state.transport.renderRange,
    triggered: _.get(state.throwdown[ownProps.snip].stems[ownProps.slug], 'trigger', false),
    lastRenderEndTime: _.get(state.throwdown[ownProps.snip].stems[ownProps.slug], 'renderPosition', 0),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
  };
}

class MidiPatternServiceComponent extends React.Component {
  constructor(props) {
    super(props);

    this.notes = props.notes || [];
    this.slug = props.slug || "drums";
    this.part = props.part || this.slug; // hmm ,.. weird fallback, but handy if you don't want to name your parts
    this.duration = props.duration || 4;

    this.startBeats = props.startBeats || [0];
    this.endBeats = props.endBeats || [0];

    this.triggered = false;
    this.playing = false;
  }

  // componentWillMount() {
  //   this.audioContext = new AudioContext();
  // }
  
  componentWillUnmount() {
    // what audio objects do we need to free?
    // this.stopAt();
  }
  
  // shouldComponentUpdate(props) {
  //   return props.events.length > 0;
  // }
  
  componentWillUpdate(props) {
    const { snip, slug, triggered, renderRange, lastRenderEndTime, transportPlayState } = props;

    if (lastRenderEndTime >= _.get(renderRange, 'end.time', 0))
      return;

    // console.log('update midi stem', slug, renderRange.start.time, lastRenderEndTime);

    const triggerState = triggered;
    this.updateAndRenderMidi(renderRange, triggerState);

    store.dispatch(throwdownActions.throwdown_updateSnipStemRenderPosition({
      snip: snip,
      slug: slug,
      time: renderRange.end.time,
    }));
  }

  getMidiChannelForPart(partName) {
    // default - drums, percussion, etc
    let outputChannel = 0;

    if (_.includes(['sub', 'bass', 'ridge'], partName)) 
      outputChannel = 1;
    else if (_.includes(['synth', 'chords', 'uplands'], partName)) 
      outputChannel = 2;
    if (_.includes(['lead', 'pad', 'fx', 'voc', 'vocal', 'hills'], partName)) 
      outputChannel = 3;

    return outputChannel;
  }

  updateAndRenderMidi(renderRange, triggerState) {
    const { duration, part } = this;
    this.triggered = triggerState;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      this.triggered,
      this.playing, 
      this.sampleLengthBeats,
      this.startBeats,
      this.endBeats,
    );
    this.playing = triggerInfo.isPlaying;

    // filter out events that are not within the (triggered-on) render range
    // should this happen in renderPatternEvents or outside?
    // do we need to factor out the core of event rendering from renderPatternEvents so we can use it without the filter??
    let filteredNotes = _.filter(this.notes, function(noteEvent) {
      return bpmUtilities.valueInWrappedBeatRange(
        noteEvent.start, 
        triggerInfo.startBeat % duration, 
        triggerInfo.endBeat % duration, 
        duration
      );
    });


    let scheduledNotes = patternSequencer.renderPatternEvents(renderRange, this.duration, filteredNotes);

    _.map(scheduledNotes, (item) => {
      var note = { 
        port: renderRange.midiOutPort, 

        channel: this.getMidiChannelForPart(part),
        note: item.event.note,

        velocity: item.event.velocity || 100, 
        duration: item.duration, 
        timestamp: item.start
      };
      midiUtilities.renderNote(note);
    });
    // here we "render" a single note-like event for the onset or offset of the audio stem
    // the API supports this but makes it feel strange .. 
    // e.g. fake ignored duration value
    // let triggerEvents = [];
    // if (triggerInfo.triggerOnset >= 0) {
    //   triggerEvents = patternSequencer.renderPatternEvents(renderRange, this.sampleLengthBeats, [{ start: triggerInfo.triggerOnset, duration: -1 }]);
    //   let time = (triggerEvents[0].start + renderRange.audioContextTimeOffsetMsec) / 1000;
    //   let beat = triggerInfo.triggerOnset;
    //   console.log(`audio  onset t=${time.toFixed(2)} b=${beat.toFixed(2)} c=${this.audioContext.currentTime} ~c=${renderRange.audioContextTimeOffsetMsec}`)

    //   this.playAt(time, triggerInfo.triggerOnset, renderRange.tempoBpm, audioDestinationNode);
    // }
    // else if (triggerInfo.triggerOffset >= 0) {
    //   triggerEvents = patternSequencer.renderPatternEvents(renderRange, this.sampleLengthBeats, [{ start: triggerInfo.triggerOffset, duration: -1 }]);
    //   let time = (triggerEvents[0].start + renderRange.audioContextTimeOffsetMsec) / 1000;
    //   let beat = triggerInfo.triggerOffset;
    //   console.log(`audio offset t=${time.toFixed(2)} b=${beat.toFixed(2)} c=${this.audioContext.currentTime} ~c=${renderRange.audioContextTimeOffsetMsec}`)

    //   this.stopAt(time);
    // }
  }
  
  render() {
    // we are an audio component, not an HTML element/DOM component
    return null;
  }
}

// export default AudioStemService;

const MidiPatternService = connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiPatternServiceComponent);

export default MidiPatternService;