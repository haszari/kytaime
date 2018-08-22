
import _ from 'lodash';

export const getTransport = (state) => { 
  return state.transport;
};

export const transportIsPlaying = (state) => { 
  const transport = getTransport(state);
  return transport && transport.playState == 'playing';
};
