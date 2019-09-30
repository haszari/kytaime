/*
Routines to help sequence patterns and trigger / untrigger patterns at appropriate beats.

This is arguably where some magic happens.

Other sequencers only have patterns start at the start (0) and end at the end, but music can be more fluid than that :)
*/

import _ from 'lodash';

import bpmUtilities from './bpm-utilities';

/***
  renderPatternTrigger
  Provides the ability to trigger (start, drop) and untrigger (stop) patterns (loops, midi patterns, beats).

  Triggering and untriggering occurs on the nearest appropriate point.

  Appropriate times for start/stop are specified via triggerBeats and untriggerBeats.

  This allows patterns that only start on the first snare (beat 3), or stop jsut before the 4th beat, or for anacrusis.

  returns
  {
    isPlaying: boolean indicating whether pattern is playing (coarse, e.g. for UI really)
    triggerOnset: if pattern triggers on this render, this is what beat it happens at (otherwise -1)
    triggerOffset: same as triggerOnset, but for when the pattern is triggered off
    startBeat, endBeat: the range of time that this pattern should be rendered; sometimes smaller, if has just been triggered on or off
  }
*/
function renderPatternTrigger(
  tempoBpm,
  renderRangeBeats, // { start, end } in beats
  isTriggered, isPlaying, // current state
  triggerQuant, // what cycle length we want to trigger within, aka the loop length
  triggerBeats, // beat positions within the pattern that are OK to trigger (start) at
  unTriggerBeats, // beat positions within the pattern that are OK to untrigger (stop) at
  // mode // future - alternatives to picking the closest (un)trigger beat
) {
  // defaults
  triggerQuant = triggerQuant || 4;
  triggerBeats = triggerBeats || [ 0, ];
  unTriggerBeats = unTriggerBeats || [ 0, ];
  // mode = 'closest'; // we don't support modes yet!

  // defaults for our return value, what we provide to client
  // render time range in global transport beats
  let renderInfo = {
    isPlaying: isPlaying,
    tempoBpm: tempoBpm,
    startBeat: undefined,
    endBeat: undefined,
    triggerOnset: -1,
    triggerOffset: -1,
  };

  // not playing, not triggered, don't play
  if ( !isPlaying && !isTriggered ) {
    return renderInfo;
  }
  // playing, triggered, so keep playing
  if ( isPlaying && isTriggered ) {
    renderInfo.startBeat = renderRangeBeats.start;
    renderInfo.endBeat = renderRangeBeats.end;
    return renderInfo;
  }

  // from here on we may be starting or stopping play during the render chunk

  // the inside of the two ifs needs to be a function

  // render range in terms of trigger quant (rather than since the beginning of playback)
  var phrase = {
    renderStart: ( renderRangeBeats.start % triggerQuant ),
    renderEnd: ( renderRangeBeats.end % triggerQuant ),
  };
  var beat;

  // see if we are going to drop (% quant) this render buffer
  if ( !isPlaying && isTriggered ) {
    renderInfo.endBeat = renderRangeBeats.end;
    // find a trigger start beat..
    beat = _.find( triggerBeats, function( startBeat ) {
      // might need to express start & stop relative to loop/phrase, i.e. negative for mute early, positive to stop during next bar/phrase
      return bpmUtilities.valueInWrappedBeatRange(
        startBeat, phrase.renderStart, phrase.renderEnd,
        triggerQuant
      );
    } );
    if ( !_.isUndefined( beat ) ) {
      renderInfo.startBeat = beat;
      renderInfo.isPlaying = true;
      renderInfo.triggerOnset = beat;
      // console.log(`trig ON! b=${renderInfo.triggerOnset}`);
    }
  }

  // see if we are going to undrop (% quant) this render buffer
  if ( isPlaying && !isTriggered ) {
    renderInfo.startBeat = renderRangeBeats.start;
    renderInfo.endBeat = renderRangeBeats.end;
    beat = _.find( unTriggerBeats, function( beat ) {
      return bpmUtilities.valueInWrappedBeatRange( beat,
        phrase.renderStart, phrase.renderEnd,
        triggerQuant
      );
    } );
    if ( !_.isUndefined( beat ) ) {
      renderInfo.endBeat = beat;
      renderInfo.isPlaying = false;
      renderInfo.triggerOffset = beat;
      // console.log(`trig off b=${renderInfo.triggerOffset}`);
    }
  }

  return renderInfo;
}

/***
  renderPatternEvents
  Implements sequencing of note-like events by mapping the event beat info to timeline msec.

  returns array of
  {
    start: // msec start time, absolute
    duration: // msec duration
    event: // passed in event data
  }
*/
const renderPatternEvents = function(
  renderStartMsec,
  tempoBpm,
  renderRangeBeats,
  cycleBeats, // cycle (loop) length for pattern
  events, // must have { start, duration } in pattern-beats, and whatever else you need to render
  debug,
) {
  debug = debug || false;

  // start and end of render range in pattern-beats
  let renderStart = ( renderRangeBeats.start % cycleBeats );
  let renderEnd = ( renderRangeBeats.end % cycleBeats );

  // loop over the events, calculate sequence time info, map to new array
  return _.map( events, function( noteEvent ) {
    var beatOffset = noteEvent.start - renderStart;

    // account for crossing loop boundary
    if ( ( renderEnd < renderStart ) && ( noteEvent.start < renderStart ) ) {
      beatOffset += cycleBeats;
    }

    var timestamp = bpmUtilities.beatsToMs( tempoBpm, beatOffset );
    var absoluteTimestamp = renderStartMsec + timestamp;

    var duration = bpmUtilities.beatsToMs( tempoBpm, noteEvent.duration );

    if ( debug ) { console.log( `rendered event renderStartBeat=${ renderStart.toFixed( 3 ) } b=${ noteEvent.start } t=${ timestamp } T=${ timestamp }` ); }

    // return absolute render info as msec + original event
    return {
      start: absoluteTimestamp,
      duration: duration,
      event: noteEvent,
    };
  } );
};

export default {
  renderPatternTrigger,
  renderPatternEvents,
};
