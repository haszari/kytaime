// import _ from 'lodash'; 

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import throwdownSelectors from './selectors';

import actions from './actions';

function SectionTrigger( props ) {
  const styles = {};
  styles.fontWeight = props.playing ? 'bold' : 'normal';
  styles.fontStyle = props.triggered ? 'italic' : 'normal';
  const toggleTrigger = props.onSetTriggeredSection.bind(
    null,
    props.triggered ? null : props.slug
  );
  return (
    <div>
      <span 
        onClick={ toggleTrigger }
        style={ styles }
      >
        { props.slug }
      </span>
    </div>
  );
}

SectionTrigger.propTypes = {
  playing: PropTypes.bool,
  triggered: PropTypes.bool,
  onSetTriggeredSection: PropTypes.func,
  slug: PropTypes.string,
}

function DeckSectionsTriggersComponent( props ) {
  const sections = props.sections.map( 
    ( section ) => {
      // const state = _.find( props.deckState, { 'slug': section.slug } ) || {};
      return ( 
        <SectionTrigger 
          key={ section.slug }
          triggered={ props.deckState.triggeredSection === section.slug }
          playing={ false }
          slug={ section.slug }
          onSetTriggeredSection={ props.onSetTriggeredSection }
        />
      );
    }
  );
  return (
    <div>
      { sections }
    </div>
  );
}

DeckSectionsTriggersComponent.propTypes = {
  sections: PropTypes.array,
  deckState: PropTypes.object,
  onSetTriggeredSection: PropTypes.func,
}

const mapStateToProps = state => {
  const sections = throwdownSelectors.getSections( state );
  const deckState = throwdownSelectors.getDeck( state );

  return {
    sections,
    deckState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetTriggeredSection: ( sectionSlug ) => {
      dispatch(
        actions.setDeckTriggeredSection( {
          sectionSlug 
        } ) 
      )
    }
  }
}

const DeckSectionsTriggers = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeckSectionsTriggersComponent)

export default DeckSectionsTriggers;