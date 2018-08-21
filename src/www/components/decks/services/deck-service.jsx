
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
    const { sections, triggerPhraseDuration, audioContext, id, setDeckSectionPartPlaying } = this.props;

    const allSections = _.map( sections, ( section ) => 
      <SectionService 
        audioContext={ audioContext } 
        
        deckId={ id } 

        key={ section.id } 
        id={ section.id } 

        triggerPhraseDuration={ triggerPhraseDuration }
        triggered={ section.triggered } 
        playing={ section.playing } 

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