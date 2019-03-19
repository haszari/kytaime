import _ from 'lodash';

// const channelConventions_six_channels = {
//   drums: 0, 
//   beat: 0, 
//   kick: 0, 
//   hat: 0, 
//   snare: 0, 
//   clap: 0, 
//   perc: 0, 
  
//   bass: 1, 
//   sub: 1, 

//   chords: 2, 
//   pad: 2, 
  
//   lead: 3,
//   synth: 3,
//   melody: 3,
//   stab: 3,
//   arp: 3,
//   arpeggio: 3,

//   vocal: 4,
//   voc: 4,
//   sample: 4,
  
//   texture: 5,
//   fx: 5,
// };

// we only have four pairs in Ableton Live Intro, so let's use them more carefully
const channelConventions_four_channels = {
  // percussion of any kind
  drums: 0, 
  beat: 0, 
  kick: 0, 
  hat: 0, 
  snare: 0, 
  clap: 0, 
  perc: 0, 
  
  // sub bass 
  bass: 1, 
  sub: 1, 

  // synth chords pad lead whatever
  chords: 2, 

  pad: 2, 
  
  lead: 2,
  synth: 2,
  melody: 2,
  stab: 2,
  arp: 2,
  arpeggio: 2,

  // vocal sample texture other misc
  vocal: 3,
  voc: 3,
  sample: 3,
  texture: 3,
  fx: 3,
};

const getChannelForPart = function( partName ) {
  // conventions for midi instruments or mixer channels
  const channel = channelConventions_four_channels[ partName ];
  if ( _.isNumber( channel ) ) {
    return channel;
  }
  else {
    return 1;
  }
}

export default getChannelForPart;