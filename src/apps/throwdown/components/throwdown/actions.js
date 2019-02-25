import { createAction } from 'redux-starter-kit';

const addPattern = createAction( 'throwdowFile/addPattern' );
const addSection = createAction( 'throwdowFile/addSection' );

export default {
  addPattern,
  addSection,
};