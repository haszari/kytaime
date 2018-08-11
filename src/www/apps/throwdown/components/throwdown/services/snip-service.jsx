
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

import AudioStemService from './audio-stem-service.jsx';


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
  if (data.audio) {
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
      return ( 
        <StemComponent
          audioContext={ audioContext } 
          snip={ slug }
          slug={ stemSlug }
          key={ stemSlug }
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