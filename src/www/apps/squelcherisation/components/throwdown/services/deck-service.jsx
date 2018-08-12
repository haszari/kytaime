
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';

import SectionService from './section-service.jsx';


// const mapStateToProps = (state, ownProps) => {
//   return { 
//     decks: state.throwdown.decks
//   }
// }

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return { };
// }

// class DeckServiceComponent extends React.Component {
class DeckService extends React.Component {
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
    const { sections, triggeredSectionId, playingSectionId, audioContext, id } = this.props;

    const allSections = _.map( sections, ( section ) => 
      <SectionService 
        audioContext={ audioContext } 
        
        deckId={ section.id } 

        key={ section.id } 
        id={ section.id } 

        triggered={ section.id === triggeredSectionId } 
        playing={ section.id === playingSectionId } 
        
        data={ section.data }  
      />
    );
    return (
      <div>
        { allSections }
      </div>
    );
  }
}

// const DeckService = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(DeckServiceComponent);

export default DeckService;