import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Hjson from 'hjson';

import throwdownSelectors from './selectors';
import dragDropSelectors from '../drag-drop/selectors';

import actions from './actions';
import dragDropActions from '../drag-drop/actions';

import deckColours from './deck-colours';

import fileImport from '../drag-drop/file-import';

import SectionTrigger from './section.jsx';

function songSectionIsValid( songSection ) {
  if ( ! songSection ) { return false; }

  return ( songSection.section && songSection.song );
}

function DeckSectionsTriggersComponent( props ) {
  const backgroundColour = deckColours.hueToBackgroundColour( props.deckState.hue, props.highlighted );
  const edgeColour = deckColours.hueToBorderColour( props.deckState.hue );
  const deckSlug = props.deckState.slug;
  const isTriggered = songSectionIsValid( props.deckState.triggeredSection );
  const isPlaying = songSectionIsValid( props.deckState.playingSection );

  const playingSong = props.deckState.playingSection ? props.deckState.playingSection.song : null;
  const playingSection = props.deckState.playingSection ? props.deckState.playingSection.section : null;

  const sections = props.deckState.sections.map(
    ( section ) => {
      // const state = _.find( props.deckState, { 'slug': section.slug } ) || {};
      const songSection = {
        section: section.slug,
        song: section.songSlug,
      };
      const key = `${ section.songSlug }-${ section.slug }`;
      return (
        <SectionTrigger
          key={ key }
          triggered={ _.isEqual( props.deckState.triggeredSection, songSection ) }
          playing={ _.isEqual( props.deckState.playingSection, songSection ) }
          songSlug={ section.songSlug }
          slug={ section.slug }
          playingSong={ playingSong }
          playingSection={ playingSection }
          onSetTriggeredSection={ props.onSetTriggeredSection }
          onSetPartTriggeredSection={ props.onSetPartTriggeredSection }
          hue={ props.deckState.hue }
          parts={ section.parts }
          playingPatterns={ props.playingPatterns }
        />
      );
    }
  );
  return (
    <tr
      className="deck-row" style={{ backgroundColor: backgroundColour }}
      onDragOver={ props.onDragOver }
      onDragLeave={ props.onDragLeave }
      onDrop={ props.onDrop }
    >
      <td>
        { props.phraseLoop }{ props.highlighted }
      </td>
      <td style={{
        borderRight: `1px solid ${ edgeColour }`,
        backgroundColor: backgroundColour,
      }}>
        {/* deck tempo, title, metadata */}
        <div style={{
          fontWeight: isPlaying ? 'bold' : 'normal',
          fontStyle: isTriggered ? 'italic' : 'normal',
        }}>{ deckSlug }</div>
      </td>

      { sections }

      {/* this is here to expand the background to full width */}
      <td colSpan="99"></td>
    </tr>

  );
}

DeckSectionsTriggersComponent.propTypes = {
  playingPatterns: PropTypes.array,

  slug: PropTypes.string,
  deckState: PropTypes.object,
  onSetTriggeredSection: PropTypes.func,
  onSetPartTriggeredSection: PropTypes.func,

  phraseLoop: PropTypes.number,

  highlighted: PropTypes.bool,

  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
};

const mapStateToProps = ( state, ownProps ) => {
  const patterns = throwdownSelectors.getAllDeckPatterns( state, ownProps.slug );
  const deckState = throwdownSelectors.getDeck( state, ownProps.slug );
  const phraseLoop = throwdownSelectors.getDeckPhraseLoop( state, ownProps.slug );
  const dragState = dragDropSelectors.getDragDrop( state );

  return {
    playingPatterns: _.filter( patterns, { isPlaying: true } ),
    deckState,
    phraseLoop,
    highlighted: dragState.dropHighlightDeck === ownProps.slug,
  };
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
  return {
    onSetTriggeredSection: ( songSlug, sectionSlug ) => {
      dispatch(
        actions.setDeckTriggeredSection( {
          deckSlug: ownProps.slug,
          songSlug,
          sectionSlug,
        } )
      );
    },

    onSetPartTriggeredSection: ( songSlug, sectionSlug, partSlug, patternSlug ) => {
      dispatch(
        actions.setDeckSectionPartTriggeredPattern( {
          deckSlug: ownProps.slug,
          songSlug: songSlug,
          partSlug,
          sectionSlug,
          patternSlug,
        } )
      );
    },

    onDragOver: event => {
      event.preventDefault();
      dispatch( dragDropActions.setDropHighlight( {
        dropHighlightDeck: ownProps.slug,
      } ) );
    },

    onDragLeave: event => {
      event.preventDefault();
      dispatch( dragDropActions.setDropHighlight( {
        dropHighlightDeck: '',
      } ) );
    },

    onDrop: event => {
      event.preventDefault();
      event.stopPropagation();

      // should really loop and import each file as new deck
      // this blob should be a method
      if ( event.dataTransfer.files.length >= 1 ) {
        const filename = event.dataTransfer.files[0].name;
        const fileReader = new FileReader();

        fileReader.onloadend = ( loadedEvent ) => {
          const importRaw = loadedEvent.currentTarget.result;
          var importContent = Hjson.parse( importRaw );
          fileImport.importThrowdownData( filename, importContent, ownProps.slug );
        };

        fileReader.readAsText( event.dataTransfer.files[0] );
      }

      // share this aka resetDragState
      dispatch( dragDropActions.setDropHighlight() );
    },

  };
};

const DeckSectionsTriggers = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeckSectionsTriggersComponent );

export default DeckSectionsTriggers;
