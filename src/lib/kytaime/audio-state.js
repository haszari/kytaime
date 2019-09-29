/* 
Singleton module for holding the audioContext and storing loaded audio files.

Not recommended to store these in a redux / react state tree as they aren't serializable.

So this is a singleton for storing these things, alongside app state in redux or elsewhere.
*/

import { find } from 'lodash';

const state = {
  audioContext: null,
  audioBuffers: [],
};

function addAudioBuffer( filename, buffer ) {
  if ( ! filename || ! buffer ) {
    return;
  }

  state.audioBuffers.push( {
    file: filename,
    buffer: buffer,
  } );
}

function getAudioBuffer( filename ) {
  return find( state.audioBuffers, { file: filename } );
}

function getAllAudioBuffers() {
  return state.audioBuffers;
}

function getAudioContext() {
  return state.audioContext;
}

function setAudioContext( context ) {
  state.audioContext = context;
}

export default {
  addAudioBuffer, 
  getAudioBuffer,
  getAllAudioBuffers,
  getAudioContext,
  setAudioContext,
}