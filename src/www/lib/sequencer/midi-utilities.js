
//console.log('readiing midi utils')

module.exports.drumMap = {
   kick: 36, 
   stick: 37,
   snare: 38,
   clap: 39,
   hat: 42
};

module.exports.channelMap = {
   drums: 0, 
   bass: 1, 
   saw: 2,
   violin: 3, 
   stab: 4,
   sfx: 5, 
   piano: 6
};

module.exports.renderNote = function(options) {
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

module.exports.renderController = function(options) {
   // options: port, channel, controller, value, timestamp
   options.port.send(
      [0xB0 + options.channel, options.controller, options.value], 
      options.timestamp
   );
};
