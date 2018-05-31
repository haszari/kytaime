import _ from 'lodash'; 

import * as bpmUtilities from './bpm-utilities';

/***
  renderPatternTrigger
  Provides the ability to trigger (start, drop) and untrigger (stop) patterns (loops, midi patterns, beats).
  
  returns
  {
    possibly a boolean indicating whether pattern is playing (coarse, e.g. for UI really)
    something to tell client when trigger happened - in pattern time and in transport time (or not)
    something to tell client how to render events
  }
*/
function renderPatternTrigger(
  renderRange, // we may not need this whole blob - can we expand out to the minimum params we need?
  isTriggered, isPlaying, // current state
  triggerQuant, // what cycle length we want to trigger within
  triggerBeats, // beat positions within the pattern that are OK to trigger (start) at
  unTriggerBeats, // beat positions within the pattern that are OK to untrigger (stop) at
  mode // future – alternatives to picking the closest (un)trigger beat
) {
  // defaults
  triggerQuant = triggerQuant || 4;
  triggerBeats = triggerBeats || [ 0 ];
  unTriggerBeats = unTriggerBeats || [ 0 ];
  mode = 'closest'; // we don't support modes yet!

  // defaults for our return value, what we provide to client
  // render time range in global transport beats
  let renderInfo = { 
    isPlaying: isPlaying,
    tempoBpm: renderRange.tempoBpm,
    startBeat: renderRange.start.beat,
    endBeat: renderRange.end.beat,
    triggerOnset: -1,
    triggerOffset: -1,
  }
  let nullRenderInfo = { 
    isPlaying: false,
    startBeat: undefined,
    endBeat: undefined,
    triggerOnset: -1,
    triggerOffset: -1,
  }

  // playing, triggered, so keep playing
  if (isPlaying && isTriggered) {
    return renderInfo;
  }
  // not playing, not triggered, don't play
  if (!isPlaying && !isTriggered) {
    return nullRenderInfo;
  }

  // from here on we may be starting or stopping play during the render chunk

  // the inside of the two ifs needs to be a function

  // render range in terms of trigger quant (rather than since the beginning of playback)
  var phrase = {
    renderStart: (renderRange.start.beat % triggerQuant),
    renderEnd: (renderRange.end.beat % triggerQuant)
  };

  // see if we are going to drop (% quant) this render buffer
  if (!isPlaying && isTriggered) {
    // find a trigger start beat..
    var beat = _.find(triggerBeats, function(startBeat) {
      // might need to express start & stop relative to loop/phrase, i.e. negative for mute early, positive to stop during next bar/phrase
      return bpmUtilities.valueInWrappedBeatRange(
        startBeat, phrase.renderStart, phrase.renderEnd, 
        triggerQuant
      );
    });
    if (!_.isUndefined(beat)) {
      renderInfo.startBeat = beat;
      renderInfo.isPlaying = true;
      renderInfo.triggerOnset = beat;
    }
  }

  // see if we are going to undrop (% quant) this render buffer
  if (isPlaying && !isTriggered) {
    var beat = _.find(unTriggerBeats, function(beat) {
      return bpmUtilities.valueInWrappedBeatRange(beat, 
        phrase.renderStart, phrase.renderEnd, 
        triggerQuant
      );
    });
    if (!_.isUndefined(beat)) {
      renderInfo.endBeat = beat;
      renderInfo.isPlaying = false;
      renderInfo.triggerOffset = beat;
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
    event: // passed in events
  }
*/
const renderPatternEvents = function(
  renderStartTimestamp,
  triggerInfo, // { startBeat, endBeat, tempoBpm } 
  cycleBeats, // cycle (loop) length for pattern
  events, // must have { start, duration } in pattern-beats, and whatever else you need to render
) {
  // if (!triggerInfo.isPlaying) return;

  // start and end of render range in pattern-beats
  var renderStart = (triggerInfo.startBeat % cycleBeats);
  var renderEnd = (triggerInfo.endBeat % cycleBeats);

  // // filter out events that are not within the (triggered-on) render range
  // events = _.filter(events, function(noteEvent) {
  //   return bpmUtilities.valueInWrappedBeatRange(
  //     noteEvent.start, 
  //     renderStart, renderEnd, 
  //     cycleBeats
  //   );
  // });

  // loop over the events, calculate sequence time info, map to new array
  return _.map(events, function(noteEvent) {
    var beatOffset = noteEvent.start - renderStart;

    // account for crossing loop boundary
    if ((renderEnd < renderStart) && (noteEvent.start < renderStart)) {
      beatOffset += cycleBeats;
    }

    var timestamp = bpmUtilities.beatsToMs(triggerInfo.tempoBpm, beatOffset);
    var absoluteTimestamp = renderStartTimestamp + timestamp;
    var duration = bpmUtilities.beatsToMs(triggerInfo.tempoBpm, noteEvent.duration);

    // return absolute render info as msec + original event
    return {
      start: absoluteTimestamp,
      duration: duration, 
      event: noteEvent,
    }
  });
}


module.exports.renderPatternTrigger = renderPatternTrigger;
module.exports.renderPatternEvents = renderPatternEvents;

