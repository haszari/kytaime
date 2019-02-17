import _ from 'lodash';

const getChannelForPart = function( partName ) {
  // conventions for midi instruments or mixer channels
  const channelConventions = {
    drums: 0, 
    beat: 0, 
    kick: 0, 
    hat: 0, 
    snare: 0, 
    clap: 0, 
    perc: 0, 
    
    bass: 1, 
    sub: 1, 

    chords: 2, 
    pad: 2, 
    
    lead: 3,
    synth: 3,
    melody: 3,
    stab: 3,
    arp: 3,
    arpeggio: 3,

    vocal: 4,
    voc: 4,
    sample: 4,
    
    texture: 5,
    fx: 5,
  };
  const channel = channelConventions[ partName ];
  if ( _.isNumber( channel ) ) {
    return channel;
  }
  else {
    return 1;
  }
}

export default getChannelForPart;