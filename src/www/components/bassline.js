
import _ from 'lodash';

import { bassline } from '@kytaime/lib/example-patterns';
import renderNotePattern from '@kytaime/lib/render-note-pattern';

class BasslinePlayer {
  constructor(props) {
    this.props = _.defaults( props, BasslinePlayer.defaultProps );
    this.throwdownRender = this.throwdownRender.bind(this);
  }

  throwdownRender( renderRange ) {
    const currentPhraseLength = 4;
    const channel = this.props.midiChannel;
    // let { triggered, playing } = this.state;
    var triggered = true;
    var playing = true;

    renderNotePattern( 
      renderRange, renderRange.tempoBpm, currentPhraseLength,
      renderRange.midiOutPort, 
      bassline, // {notes, duration, startBeats, endBeats }
      channel, triggered, playing
    );
  }
}

BasslinePlayer.defaultProps = {
  midiChannel: 2
};


export default BasslinePlayer;