
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';

import SectionService from './section-service.jsx';


const mapStateToProps = (state, ownProps) => {
  let sections = _.filter(ownProps.sections, (section) => section.triggered || section.playing);
  return { 
    triggerPhraseDuration: selectors.getPhraseDuration(state, { 
      deckId: ownProps.id,
      sectionIds: _.map(sections, 'id'),
    }),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { sections } = ownProps;
  
  const chooseNextSectionId = () => {
    const currentSectionIndex = _.findIndex( sections, { playing: true } );  
    // here we take care to handle the one section per deck case .. which is a stupid case
    if ( sections.length ) 
      return sections[ ( currentSectionIndex + 1 ) % sections.length ].id;
    return -1;
  }

  return { 
    setDeckSectionPartPlaying: ({ sectionId, partSlug, playing }) => {
      dispatch(actions.throwdown_setPartPlaying( { deckId: ownProps.id, sectionId, partSlug, playing } ));
    },
    autoTriggerNextSection: () => {
      const newSectionId = chooseNextSectionId();
      if ( newSectionId !== -1 ) {
        dispatch(actions.throwdown_setSectionTriggered({ deckId: ownProps.id, sectionId: newSectionId, triggered: true }));
      }
    },
  };
}
class DeckServiceComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { 
      id, 
      sections, 
      triggerPhraseDuration, 

      audioContext, 

      setDeckSectionPartPlaying, 
      autoTriggerNextSection 
    } = this.props;

    const allSections = _.map( sections, ( section ) => 
      <SectionService 
        audioContext={ audioContext } 
        
        deckId={ id } 

        key={ section.id } 
        id={ section.id } 

        triggerPhraseDuration={ triggerPhraseDuration }
        triggered={ section.triggered } 
        playing={ section.playing } 
        onsetBeat={ section.onsetBeat }
        repeat={ section.repeat }

        setDeckSectionPartPlaying={ setDeckSectionPartPlaying }

        autoTriggerNextSection={ autoTriggerNextSection }
        
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