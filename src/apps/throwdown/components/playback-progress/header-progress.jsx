import { connect } from 'react-redux';

import throwdownSelectors from '../throwdown/selectors';
import PlaybackProgressComponent from './playback-progress.jsx';

const mapStateToProps = state => {
  return {
    progressPercent: throwdownSelectors.getPhraseProgress( state ) * 100.0,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaybackProgressComponent);