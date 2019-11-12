import { connect } from 'react-redux';

import throwdownSelectors from '../throwdown/selectors';
import PlaybackProgressComponent from './playback-progress.jsx';

import deckColours from '../throwdown/deck-colours';

const mapStateToProps = ( state, ownProps ) => {
  const deckState = throwdownSelectors.getDeck( state, ownProps.deckSlug );
  const hue = deckState ? deckState.hue : 0;

  const progressPercent = deckState.playingSection
    ? throwdownSelectors.getDeckPhraseProgress( state, ownProps.deckSlug ) * 100.0
    : 0;

  return {
    progressPercent,
    backgroundColour: deckColours.hueToBackgroundColour( hue ),
    progressColour: deckColours.hueToProgressColour( hue ),
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( PlaybackProgressComponent );
