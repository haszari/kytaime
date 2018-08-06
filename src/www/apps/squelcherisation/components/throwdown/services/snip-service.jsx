
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

import AudioStemService from './audio-stem-service.jsx';
import AudioSlicerService from './audio-slicer-service.jsx';
import MidiPatternService from './midi-pattern-service.jsx';


// const mapStateToProps = (state, ownProps) => {
//   return {
//     snips: state.throwdown
//   }
// }

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return { };
// }

function StemComponent(props) {
  const { snip, slug, data, audioContext } = props;
  if (props.audio) {
    const { file, tempo } = props.audio;
    if (data.slices) {
      return ( 
        <AudioSlicerService 
          key={ slug } 

          audioContext={ audioContext } 
          
          snip={ snip }
          slug={ slug } 

          audio={ file } 
          tempo={ tempo } 

          part={ data.part }
          duration={ data.duration } 
          startBeats={ data.startBeats } 
          endBeats={ data.endBeats } 
          slices={ data.slices }
        />
      )
    }
    else {
      // This may be deprecated soon .. or need to share code with more flexible AudioSlicerService
      // or, be implemented in terms of AudioSlicerService.
      // It as one feature / advantage over AudioSlicerService - it will loop the whole sample;
      // with the slicer you need to slice it up to achieve the loop and that could create little gaps.
      return ( 
        <AudioStemService 
          audioContext={ audioContext } 
          snip={ snip }
          slug={ slug } 
          key={ slug } 
          part={ data.part }
          audio={ data.audio } 
          duration={ data.duration } 
          tempo={ data.tempo } 
          startBeats={ data.startBeats } 
          endBeats={ data.endBeats } 
        />
      )
    }
  }
  if (data.notes) {
    return ( 
      <MidiPatternService 
        key={ slug } 
        
        snip={ snip }
        slug={ slug } 

        part={ data.part }
        notes={ data.notes } 
        duration={ data.duration } 
      />
    )
  }
  else 
    return null;
}

class SnipService extends React.Component {
  constructor(props) {
    super(props);
  }
  // componentWillMount() {
  //   this.audioContext = new AudioContext();
  // }
  
  // componentWillUnmount() {
  //   this.audioContext.close();
  // }
  
  // shouldComponentUpdate(props) {
  //   return props.events.length > 0;
  // }
  
  // componentWillUpdate(props) {
  //   props.events.forEach(this.processEvent.bind(this));
  //   props.dispatch({
  //     type: "CLEAR_EVENT_QUEUE"
  //   });
  // }
  
  render() {
    const { slug, stems, audioContext } = this.props;
    const allStems = _.map(stems, (stem, stemSlug) => {
      let audio = stem.audio || undefined;
      return ( 
        <StemComponent
          key={ stemSlug }

          audioContext={ audioContext } 

          snip={ slug }
          slug={ stemSlug }

          audio={ audio }
          
          data={ stem.data }
        />
      );
    });
    return (
      <div>
        { allStems }
      </div>
    );
  }
}

// const SnipService = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(SnipServiceComponent);

// export default SnipService;
export default SnipService;