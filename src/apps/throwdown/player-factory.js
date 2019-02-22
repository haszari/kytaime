import getChannelForPart from './get-channel-for-part';

import MidiLoopPlayer from './components/midi-loop-player';
import SampleSlicePlayer from './components/sample-slice-player';

function playerFromFilePatternData( patternData, slug ) {
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
    return new SampleSlicePlayer( {
      channel: channel, // not yet used!
      audioFile: patternData.file,
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