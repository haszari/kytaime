
import * as bpmUtilities from '../../lib/sequencer/bpm-utilities';
import * as midiUtilities from '../../lib/sequencer/midi-utilities';

const swing = 0.14;

let pattern = {
  duration: 4,
  startBeats: [0, 0.98], // start on first kick or snare
  endBeats: [0.49], // always end on a 1
  notes: [
    { 
      start: 0, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },
    { 
      start: 1, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },
    { 
      start: 2, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },
    { 
      start: 3, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },

    { 
      start: 0.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },
    { 
      start: 1.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },
    { 
      start: 2.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },
    { 
      start: 3.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },


    { 
      start: 0.98, 
      duration: 1, 
      note: 39, 
      velocity: 100 
      },
    { 
      start: 2.98, 
      duration: 1, 
      note: 39, 
      velocity: 100 
      },

    { 
      start: 3, 
      duration: 1, 
      note: 37, 
      velocity: 110 
    },
  ]
};

let patternTriggerState = {
  triggered: true,
  playing: false,
}

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
  }
  let nullRenderInfo = { 
    isPlaying: false,
    startBeat: undefined,
    endBeat: undefined,
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
    var triggerStart = _.find(triggerBeats, function(startBeat) {
      // might need to express start & stop relative to loop/phrase, i.e. negative for mute early, positive to stop during next bar/phrase
      return bpmUtilities.valueInWrappedBeatRange(
        startBeat, phrase.renderStart, phrase.renderEnd, 
        triggerQuant
      );
    });
    if (!_.isUndefined(triggerStart)) {
      renderInfo.startBeat = triggerStart;
      renderInfo.isPlaying = true;
    }
  }

  // see if we are going to undrop (% quant) this render buffer
  if (isPlaying && !isTriggered) {
    var triggerEnd = _.find(endBeats, function(beat) {
      return bpmUtilities.valueInWrappedBeatRange(beat, 
        phrase.renderStart, phrase.renderEnd, 
        patternDropStopModulus
      );
    });
    if (!_.isUndefined(triggerEnd)) {
      renderInfo.endBeat = triggerEnd;
      renderInfo.isPlaying = false;
    }
  }

 return renderInfo;
}

/***
  renderPatternEvents
  Implements sequencing of note-like events, with callback for client to implement playback of actual notes (e.g. as audio, midi, etc).
*/
const renderPatternEvents = function(
  renderStartTimestamp,
  triggerInfo, // { startBeat, endBeat, tempoBpm, isPlaying }
  cycleBeats, // cycle (loop) length for pattern
  events, // must have { start, duration } in pattern-beats, and whatever else you need to render
  renderFunc, // function(startTimestamp, msecDuration, event) {}
) {
  if (!triggerInfo.isPlaying) return;

  // start and end of render range in pattern-beats
  var renderStart = (triggerInfo.startBeat % cycleBeats);
  var renderEnd = (triggerInfo.endBeat % cycleBeats);

  // filter out events that are not within the (triggered-on) render range
  events = _.filter(events, function(noteEvent) {
    return bpmUtilities.valueInWrappedBeatRange(
      noteEvent.start, 
      renderStart, renderEnd, 
      cycleBeats
    );
  });

  // loop over the events, calculate sequence time info, and call back to render each event
  _.each(events, function(noteEvent) {
    var beatOffset = noteEvent.start - renderStart;

      // account for crossing loop boundary
      if ((renderEnd < renderStart) && (noteEvent.start < renderStart)) {
        beatOffset += cycleBeats;
      }

      var timestamp = bpmUtilities.beatsToMs(triggerInfo.tempoBpm, beatOffset);
      var absoluteTimestamp = renderStartTimestamp + timestamp;
      var duration = bpmUtilities.beatsToMs(triggerInfo.tempoBpm, noteEvent.duration);

      renderFunc(absoluteTimestamp, duration, noteEvent);
    });

}


const renderTestPattern = function(renderRange, midiOutPort, channel) {

  let triggerInfo = renderPatternTrigger(
    renderRange, 
    patternTriggerState.triggered,
    patternTriggerState.playing, 
    pattern.duration,
    pattern.startBeats,
    pattern.endBeats,
  );

  renderPatternEvents(renderRange.start.time, triggerInfo, pattern.duration, pattern.notes, (startTimestamp, msecDuration, event) => {
    var note = { 
      port: midiOutPort, 

      channel: channel + 1,
      note: event.note,

      velocity: event.velocity, 
      duration: msecDuration, 
      timestamp: startTimestamp
    };
    midiUtilities.renderNote(note);    
  });

  patternTriggerState.playing = triggerInfo.isPlaying;
  console.log(`test render: beats=${renderRange.start.beat.toFixed(2)} start=${triggerInfo.startBeat.toFixed(2)}, end=${triggerInfo.endBeat.toFixed(2)}`);
}

export default renderTestPattern;
