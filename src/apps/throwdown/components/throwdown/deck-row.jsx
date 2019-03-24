import Color from 'color'; 

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import throwdownSelectors from './selectors';

import actions from './actions';

function hueToBackgroundColour( hue ) {
 return Color.hsl(
    Math.floor( hue ), 75, 75,
  ).hex();
} 

function hueToBorderColour( hue ) {
 return Color.hsl(
    Math.floor( hue ), 75, 50,
  ).hex();
} 

function hueToProgressColour( hue ) {
 return Color.hsl(
    Math.floor( hue ), 75, 25,
  ).hex();
} 

function SectionTrigger( props ) {
  const styles = {};
  styles.fontWeight = props.playing ? 'bold' : 'normal';
  styles.fontStyle = props.triggered ? 'italic' : 'normal';
  const toggleTrigger = props.onSetTriggeredSection.bind(
    null,
    props.triggered ? null : props.slug
  );
  return (
    <td>
      <span 
        onClick={ toggleTrigger }
        style={ styles }
      >
        { props.slug }
      </span>
    </td>
  );
}

SectionTrigger.propTypes = {
  playing: PropTypes.bool,
  triggered: PropTypes.bool,
  onSetTriggeredSection: PropTypes.func,
  slug: PropTypes.string,
  hue: PropTypes.number,
}

function DeckSectionsTriggersComponent( props ) {
  const backgroundColour = hueToBackgroundColour( props.deckState.hue );
  const edgeColour = hueToBorderColour( props.deckState.hue );

  const sections = props.deckState.sections.map( 
    ( section ) => {
      // const state = _.find( props.deckState, { 'slug': section.slug } ) || {};
      return ( 
        <SectionTrigger 
          key={ section.slug }
          triggered={ props.deckState.triggeredSection === section.slug }
          playing={ props.deckState.playingSection === section.slug }
          slug={ section.slug }
          onSetTriggeredSection={ props.onSetTriggeredSection }
          hue={ props.deckState.hue }
        />
      );
    }
  );
  return (
    <tr className="deck-row" style={{ backgroundColor: backgroundColour }}>
      <td>
       {/* deck phrase length */}
      </td>
      <td style={{ 
        borderRight: `1px solid ${ edgeColour }`,
        backgroundColor: backgroundColour,
      }}>
        {/* deck tempo, title, metadata */}
        <div style={{ 
          fontWeight: 'bold'
        }}>test</div>
      </td>
      { sections }
    </tr>

  );
}

DeckSectionsTriggersComponent.propTypes = {
  slug: PropTypes.string,
  deckState: PropTypes.object,
  onSetTriggeredSection: PropTypes.func,
}

const mapStateToProps = ( state, ownProps ) => {
  const deckState = throwdownSelectors.getDeck( state, ownProps.slug );

  return {
    deckState,
  }
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
  return {
    onSetTriggeredSection: ( sectionSlug ) => {
      dispatch(
        actions.setDeckTriggeredSection( {
          deckSlug: ownProps.slug,
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