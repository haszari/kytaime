
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';


// should I hook up the actions using redux instead - mapDispatchToProps?
// yes
import store from '../../../stores/store';

import * as actions from '../actions';
import * as selectors from '../selectors';

import * as transportSelectors from '../../transport/selectors';


import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';


import AudioSlicePlayer from './audio-slice-player';
import AudioStemPlayer from './audio-stem-player';
import MidiPatternPlayer from './midi-pattern-player';


const mapStateToProps = (state, ownProps) => {
  const ownSection = selectors.getSection(state, { 
    deckId: ownProps.deckId,
    sectionId: ownProps.id,
  });
  return { 
    transportIsPlaying: transportSelectors.transportIsPlaying(state),
    renderRange: state.transport.renderRange,
    lastRenderEndTime: ownSection ? ownSection.renderPosition : null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

class SectionServiceComponent extends React.Component {
  constructor(props) {
    super(props);

    const { id, audioContext, parts, setDeckSectionPartPlaying } = props;


    this.slicePlayers = _.filter(parts, (part) => {
      return (part.data.audio || part.data.pattern);
    }).map((part) => {
      const { audio, pattern } = part.data;
      let slices = pattern.slices;
      let notes = pattern.notes;
      let updatePlayingState = ( isPlaying ) => {
        setDeckSectionPartPlaying( { sectionId: id, partSlug: part.slug, playing: isPlaying } );
      };
      if (notes) {
        return new MidiPatternPlayer({
          key: part.slug,
          slug: part.slug,

          part: part.part,

          triggered: part.triggered,

          duration: pattern.duration,
          startBeats: pattern.startBeats, 
          endBeats: pattern.endBeats, 

          updatePlayingState: updatePlayingState,
          
          notes: pattern.notes,
        });

      }
      else if (slices && slices.length) {
        return new AudioSlicePlayer({
          key: part.slug,
          slug: part.slug,

          audioContext: audioContext,
          
          part: part.part,

          triggered: part.triggered,

          audio: audio.file,
          tempo: audio.tempo, 

          duration: pattern.duration,
          zeroBeat: pattern.zeroBeat,

          startBeats: pattern.startBeats, 
          endBeats: pattern.endBeats, 

          updatePlayingState: updatePlayingState,
          
          slices: pattern.slices,
        });
      }
      else {
        return new AudioStemPlayer({
          key: part.slug,
          slug: part.slug,

          audioContext: audioContext,
          
          part: part.part,

          triggered: part.triggered,

          audio: audio.file,
          tempo: audio.tempo, 

          duration: pattern.duration,
          zeroBeat: pattern.zeroBeat,
          startOffset: pattern.startOffset,

          startBeats: pattern.startBeats, 
          endBeats: pattern.endBeats, 

          updatePlayingState: updatePlayingState,
        });        
      }
    });
  }

  componentWillUpdate(props) {
    const { 
      deckId, id, 
      triggered, playing, 
      triggerPhraseDuration, onsetBeat, 
      renderRange, lastRenderEndTime, 
      transportIsPlaying, 
      repeat, autoTriggerNextSection,
      parts 
    } = props;

    if ( !transportIsPlaying ) {
      _.map(this.slicePlayers, ( player ) => {
        player.stop();
      });
      if (playing) {        
        store.dispatch(actions.throwdown_setSectionPlaying({
          deckId: deckId,
          sectionId: id,
          playing: false,
        }));
      }
    }

    if (lastRenderEndTime >= _.get(renderRange, 'end.time', 0))
      return;

    const isThisSectionTriggered = triggered;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      triggered,
      playing, 
      triggerPhraseDuration,
    );

    const isThisSectionPlaying = triggerInfo.isPlaying;

    const audioDestinationNode = renderRange.audioContext.destination;
    _.map(this.slicePlayers, ( player ) => {
      const part = _.find(parts, { slug: player.slug });
      player.updateAndRenderAudio(renderRange, part.triggered && isThisSectionPlaying, part.playing, audioDestinationNode);
    });

    if (triggerInfo.triggerOnset >= 0) {
      // we are triggering on
      // store the absolute beat we started at
      // so we can keep track of how long we've been playing
      const onsetInfo = patternSequencer.renderPatternEvents(
        renderRange, 
        triggerPhraseDuration,
        [{ start: triggerInfo.triggerOnset, duration: 1 }]
      );
      const sectionOnsetBeat = renderRange.start.beat + onsetInfo[0].beatOffset;
      store.dispatch(actions.throwdown_setSectionOnsetBeat({
        deckId: deckId,
        sectionId: id,
        onsetBeat: sectionOnsetBeat,
      }));
    }

    const playbackBeats = renderRange.end.beat - onsetBeat;
    const repeatDurationBeats = repeat * triggerPhraseDuration;
    const autoTriggerNextSectionToleranceBeats = 4;
    if ( playing && triggered && repeatDurationBeats > 0 && ( repeatDurationBeats - playbackBeats ) <= autoTriggerNextSectionToleranceBeats ) {
      autoTriggerNextSection();
    }



    store.dispatch(actions.throwdown_updateSectionRenderPosition({
      deckId: deckId,
      sectionId: id,
      time: renderRange.end.time,
      playbackBeats: playbackBeats,
    }));
    store.dispatch(actions.throwdown_setSectionPlaying({
      deckId: deckId,
      sectionId: id,
      playing: isThisSectionPlaying,
    }));
  }


  render() {
    // we are a service component!
    return null;
  }
}

const SectionService = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionServiceComponent);

export default SectionService;