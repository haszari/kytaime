import { createSelector } from 'redux-starter-kit';

// 'throwdown' path is hard-coded in all these AND in store.js .. how to share that?
const getThrowdown = createSelector( [ 'throwdown' ] );
const getSections = createSelector( [ 'throwdown.sections' ] );
const getPatterns = createSelector( [ 'throwdown.patterns' ] );
const getBuffers = createSelector( [ 'throwdown.buffers' ] );

const getDeck = createSelector( [ 'throwdown.deck' ] );

export default {
  getThrowdown,
  getSections,
  getPatterns,
  getDeck,
  getBuffers,
};