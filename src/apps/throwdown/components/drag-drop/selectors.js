import { get, } from 'lodash';

const getDragDrop = ( state ) => { return get( state, 'dragDrop' ); };

export default {
  getDragDrop,
};
