
import _ from 'lodash';

import { bassline } from '@kytaime/lib/data/example-patterns';
import renderNotePattern from '@kytaime/lib/render-note-pattern';

class BasslinePlayer {
  constructor(props) {
    this.props = _.defaults( props, BasslinePlayer.defaultProps );
    this.throwdownRender = this.throwdownRender.bind(this);
  }

  throwdownRender( renderMsec, tempoBpm, renderBeats, midiOutPort ) {
    const currentPhraseLength = 4;
    const channel = this.props.midiChannel;
    // let { triggered, playing } = this.state;
    var triggered = true;
    var playing = true;

    renderNotePattern( 
      renderMsec, 
      tempoBpm, 
      renderBeats,
      currentPhraseLength,
      midiOutPort, 
      bassline, // {notes, duration, startBeats, endBeats }
      channel, 
      triggered, 
      playing
    );
  }
}

BasslinePlayer.defaultProps = {
  midiChannel: 2
};


export default BasslinePlayer;