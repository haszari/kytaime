import _ from 'lodash';

import getChannelForPart from './get-channel-for-part';

import MidiLoopPlayer from './components/midi-loop-player';
import SampleSlicePlayer from './components/sample-slice-player';

function playerFromFilePatternData( patternData, slug, buffers ) {
  var channel = patternData.channel || getChannelForPart( patternData.part || slug );
  if ( patternData.notes ) {
    return new MidiLoopPlayer( {
      channel: channel, 
      notes: patternData.notes,
      duration: patternData.duration,
      startBeats: patternData.startBeats,
      endBeats: patternData.endBeats,
    } ) ;
  }
  if ( patternData.file ) {
    // const channel = getChannelForPart( resource.part || key );
    const stateBuffer = _.find( buffers, { file: patternData.file } );
    if ( ! stateBuffer ) {
      return;
    }
    return new SampleSlicePlayer( {
      channel: channel, // not yet used!
      audioFile: patternData.file,
      buffer: stateBuffer.buffer,
      tempoBpm: patternData.tempo, 
      sampleDuration: patternData.duration,
      startBeats: patternData.startBeats,
      endBeats: patternData.endBeats,
    } );
  }
  return null;
}

export default {
  playerFromFilePatternData,
};