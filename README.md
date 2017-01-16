# *Kytaime* - javascript MIDI pattern sequencer

### About
This is a prototype midi pattern sequencer. When it grows up it will support jamming, live arrangement or performance workflows.

Right now you can import midi pattern loops into a grid, and trigger them so they play back, sending midi to other software or hardware via [Web MIDI](https://webaudio.github.io/web-midi-api/).

I wrote this for myself, for fun and the flexibility that I can adapt it to my needs. If it sounds interesting to you, [get in touch](mailto:kytaime@cartoonbeats.com)! 

### Quick Start
1. Clone this repo.
2. `npm install`
3. `npm start` to start the server
4. `./node_modules/.bin/electron .` to start the electron app

### How To Use
- Toolbar:
  - Edit mode on/off (pencil icon, left).
  - Play/stop button in top right.
  - Current beat is displayed in the middle (when playing).
- Pattern grid:
  - When edit mode is enabled (red pencil):
    - Click + on a row to load a midi file.
    - Click :trash: to remove a pattern.
  - When edit mode is disabled:
    - Click a pattern cell to trigger. 
      - The border will highlight, indicating it is triggered.
        - If you click it again, you can untrigger it.
      - When triggered, patterns will play on the next appropriate beat, e.g. mod 4.
      - Patterns loop until you untrigger.
        - They will stop at an appropriate beat, e.g. the end of the loop.
  - Each row transmits to a midi channel.
    - The channel number is displayed in the circle on the right.

You can do other things in the console, such as change the midi channel for a row, or set the number of rows.

### Technical Info
A [Web Worker](https://en.wikipedia.org/wiki/Web_worker) is used to get accurate timing no matter what. This currently doesn't work well in inactive [Google Chrome](http://google.com/chrome) tabs (i.e. minimised, hidden or offscreen) (worked wonderfully until recently, around Chrome 54). 

It's working great as an [Electron](http://electron.atom.io) app though.

You can use in a web browser by browsing to `localhost:6041`.

