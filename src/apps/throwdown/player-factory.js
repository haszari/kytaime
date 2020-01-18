import _ from 'lodash';

import MidiLoopPlayer from './components/midi-loop-player';
import SampleSlicePlayer from './components/sample-slice-player';

function getPlayerProps( patternData, buffers, channel ) {
  if ( patternData.notes ) {
    return {
      channel: channel,
      notes: patternData.notes,
      duration: patternData.duration,
      startBeats: patternData.startBeats,
      endBeats: patternData.endBeats,
    };
  }
  if ( patternData.file ) {
    const stateBuffer = _.find( buffers, { file: patternData.file } );
    if ( !stateBuffer ) {
      return null;
    }
    return {
      channel: channel,
      audioFile: patternData.file,
      buffer: stateBuffer.buffer,
      offset: patternData.offset,
      tempoBpm: patternData.tempo,
      sampleDuration: patternData.duration,
      startBeats: patternData.startBeats,
      endBeats: patternData.endBeats,

      // We clone this because we may want to fill in missing slice details like duration.
      // If we don't clone it, the object is not extensible.
      slices: _.cloneDeep( patternData.slices ),
    };
  }
  return null;
}

function playerFromFilePatternData( patternData, buffers, channel ) {
  const props = getPlayerProps( patternData, buffers, channel );
  if ( !props ) {
    return null;
  }

  if ( patternData.notes ) {
    return new MidiLoopPlayer( props );
  }
  if ( patternData.file ) {
    return new SampleSlicePlayer( props );
  }
  return null;
}

export default {
  playerFromFilePatternData,
  getPlayerProps,
};
