import { createSelector } from 'redux-starter-kit';

const getDragDrop = createSelector( [ 'dragDrop' ] );

export default {
  getDragDrop,
};