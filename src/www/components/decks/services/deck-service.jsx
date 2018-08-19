
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
  return { 
    setDeckSectionPartPlaying: ({ sectionId, partSlug, playing }) => {
      dispatch(actions.throwdown_setPartPlaying( { deckId: ownProps.id, sectionId, partSlug, playing } ));
    },
  };
}
class DeckServiceComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { sections, triggeredSectionId, playingSectionId, triggerPhraseDuration, audioContext, id, setDeckSectionPartPlaying } = this.props;
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

        setDeckSectionPartPlaying={ setDeckSectionPartPlaying }
        
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