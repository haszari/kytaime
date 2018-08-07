
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

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