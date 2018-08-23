
//console.log('readiing midi utils')

const drumMap = {
   kick: 36, 
   stick: 37,
   snare: 38,
   clap: 39,
   hat: 42
};

const channelMap = {
   drums: 0, 
   bass: 1, 
   saw: 2,
   violin: 3, 
   stab: 4,
   sfx: 5, 
   piano: 6
};

export function renderNote(options) {
   // options: port, channel, noteNumber, velocity, duration, timestamp
   options.port.send(
      [0x90 + options.channel, options.note, options.velocity], 
      options.timestamp
   );
   // note off
   options.port.send(
      [0x80 + options.channel, options.note, options.velocity], 
      options.timestamp + options.duration 
   );
};

export function renderController(options) {
   // options: port, channel, controller, value, timestamp
   options.port.send(
      [0xB0 + options.channel, options.controller, options.value], 
      options.timestamp
   );
};

export function getZeroChannelForPart(partName) {
  // default - drums, percussion, etc
  let outputChannelPairOffset = 0;

  if (_.includes(['sub', 'bass', 'ridge'], partName)) 
    outputChannelPairOffset = 1;
  else if (_.includes(['lead', 'synth', 'chords', 'uplands'], partName)) 
    outputChannelPairOffset = 2;
  if (_.includes(['pad', 'fx', 'voc', 'vox', 'vocal', 'hills', 'texture'], partName)) 
    outputChannelPairOffset = 3;

  return outputChannelPairOffset;
}
