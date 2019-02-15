
import _ from 'lodash';

import renderNotePattern from '@kytaime/render-note-pattern';

class MidiLoopPlayer {
  constructor(props) {
    this.props = _.defaults( props, MidiLoopPlayer.defaultProps );
    this.throwdownRender = this.throwdownRender.bind(this);
  }

  throwdownRender( renderMsec, tempoBpm, renderBeats, midiOutPort ) {
    const currentPhraseLength = this.props.pattern.duration;
    const channel = this.props.midiChannel;
    // let { triggered, playing } = this.state;
    var triggered = true;
    var playing = true;

    renderNotePattern( 
      renderMsec.start, 
      tempoBpm, 
      renderBeats,
      currentPhraseLength,
      midiOutPort, 
      this.props.pattern, // {notes, duration, startBeats, endBeats }
      channel, 
      triggered, 
      playing
    );
  }
}

MidiLoopPlayer.defaultProps = {
  midiChannel: 2,
  pattern: [],
};


export default MidiLoopPlayer;