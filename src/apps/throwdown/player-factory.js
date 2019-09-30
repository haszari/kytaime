import _ from 'lodash';

import getChannelForPart from './get-channel-for-part';

import MidiLoopPlayer from './components/midi-loop-player';
import SampleSlicePlayer from './components/sample-slice-player';

function getPlayerProps( patternData, buffers ) {
  var channel = patternData.channel || getChannelForPart( patternData.part );
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
    // const channel = getChannelForPart( resource.part || key );
    const stateBuffer = _.find( buffers, { file: patternData.file, } );
    if ( !stateBuffer ) {
      return null;
    }
    return {
      channel: channel,
      audioFile: patternData.file,
      buffer: stateBuffer.buffer,
      tempoBpm: patternData.tempo,
      sampleDuration: patternData.duration,
      startBeats: patternData.startBeats,
      endBeats: patternData.endBeats,
      slices: patternData.slices,
    };
  }
  return null;
}

function playerFromFilePatternData( patternData, buffers ) {
  const props = getPlayerProps( patternData, buffers );
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
