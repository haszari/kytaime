
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';

import SectionService from './section-service.jsx';


const mapStateToProps = (state, ownProps) => {
  return { 
    triggerPhraseDuration: selectors.getPhraseDuration(state, { 
      deckId: ownProps.id,
      sectionIds: [ ownProps.triggeredSectionId, ownProps.playingSectionId ],
    }),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

class DeckServiceComponent extends React.Component {
// class DeckService extends React.Component {
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
    const { sections, triggeredSectionId, playingSectionId, triggerPhraseDuration, audioContext, id } = this.props;
    // console.log(`triggeredSectionId=${triggeredSectionId} playingSectionId=${playingSectionId}`);

    const allSections = _.map( sections, ( section ) => 
      <SectionService 
        audioContext={ audioContext } 
        
        deckId={ id } 

        key={ section.id } 
        id={ section.id } 

        triggerPhraseDuration={ triggerPhraseDuration }
        triggered={ section.id === triggeredSectionId } 
        playing={ section.id === playingSectionId } 
        
        parts={ section.parts }  
      />
    );
    return (
      <div>
        { allSections }
      </div>
    );
  }
}

const DeckService = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeckServiceComponent);

export default DeckService;