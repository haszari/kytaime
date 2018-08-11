
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

// import SnipService from './snip-service.jsx';


const mapStateToProps = (state, ownProps) => {
  return { }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

class ThrowdownServiceComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(props) {
    // const { snip, slug, triggered, renderRange, lastRenderEndTime, transportPlayState } = props;

    // if (lastRenderEndTime >= _.get(renderRange, 'end.time', 0))
    //   return;

    // // console.log('update midi stem', slug, renderRange.start.time, lastRenderEndTime);

    // const triggerState = triggered;
    // this.updateAndRenderMidi(renderRange, triggerState);

    // store.dispatch(throwdownActions.throwdown_updateSnipStemRenderPosition({
    //   snip: snip,
    //   slug: slug,
    //   time: renderRange.end.time,
    // }));
  }

  render() {
    // we are a service component!
    return null;
    // const { decks, audioContext } = this.props;
    // const allTheDecks = _.map( decks, ( deck ) => 
    //   // <SnipService audioContext={ audioContext } key={ snipSlug } slug={ snipSlug } stems={ snip.stems } />
    //   <div key={ deck.id }>Throwdown deck { deck.id }</div>
    // );
    // return (
    //   <div>
    //     { allTheDecks }
    //   </div>
    // );
  }
}

const DeckService = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownServiceComponent);

export default DeckService;