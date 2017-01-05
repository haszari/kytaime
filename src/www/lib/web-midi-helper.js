module.exports = class WebMidiHelper {
   static openMidiOut(options) {
      var requestedDeviceName = options.deviceName;
      var callback = options.callback;

      if (!callback) {
         return;
      }

      var successInfo = {
         port: null,
      };

      // get midi device .. and store in a global
      var access = navigator.requestMIDIAccess();
      access.then(function(midiAccess) { 
         var i = 0;
         midiAccess.outputs.forEach( function(port, key) { 
            // console.log(i++);
            // console.log({ 
            //    key: key, 
            //    port: port,
            //    name: port.name
            // });

            // // note on, chan 0 | pitch 64 | vel 64
            // port.send([0x90, 0x40, 0x40]);
            // // note off
            // port.send([0x80, 0x40, 0x40], window.performance.now() + 1000.0 );

            if (!successInfo.port || port.name == requestedDeviceName) {
               successInfo.port = port;
            }
         });

         // test tick tick thing
         // setInterval(function() {
         //    if (midiOutPort) {
         //       console.log('ding');

         //       playNote({ 
         //          port: midiOutPort, 
         //          channel: channelMap.drums, 
         //          note: drumMap.stick, 
         //          velocity: 100, 
         //          duration: 200, 
         //          timestamp: 1
         //       });
         //    }
         // }, 1000);

         // hmm, maybe I should use promises like Web MIDI uses
         callback(successInfo);

      });
   }
}