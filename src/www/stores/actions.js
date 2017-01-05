


import { TRANSPORT_CURRENT_BEAT } from './action-types';


export function transportCurrentBeat(beatNumber) {
   return { type: TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}
