import _ from 'lodash';

function getChannelConventions() {
  // const channelConventionsFourChannels = {
  //   // percussion of any kind
  //   drums: 0,
  //   beat: 0,
  //   kick: 0,
  //   hat: 0,
  //   snare: 0,
  //   clap: 0,
  //   perc: 0,

  //   // sub bass
  //   bass: 1,
  //   sub: 1,

  //   // synth chords pad lead whatever
  //   chords: 2,

  //   pad: 2,

  //   lead: 2,
  //   synth: 2,
  //   melody: 2,
  //   stab: 2,
  //   arp: 2,
  //   arpeggio: 2,

  //   // vocal sample texture other misc
  //   vocal: 3,
  //   voc: 3,
  //   sample: 3,
  //   texture: 3,
  //   fx: 3,
  // };

  const channelConventionsTwoChannels = {
    // percussion of any kind
    drums: 0,
    beat: 0,
    kick: 0,
    hat: 0,
    snare: 0,
    clap: 0,
    perc: 0,

    // sub bass
    bass: 1,
    sub: 1,

    // synth chords pad lead whatever
    chords: 1,

    pad: 1,

    lead: 1,
    synth: 1,
    melody: 1,
    stab: 1,
    arp: 1,
    arpeggio: 1,

    // vocal sample texture other misc
    vocal: 1,
    voc: 1,
    sample: 1,
    texture: 1,
    fx: 1,
  };

  return channelConventionsTwoChannels;
}

function getChannelsPerDeck() {
  const channelMap = getChannelConventions();
  return _.reduce( channelMap, ( result, value ) => {
    return Math.max( result, value );
  }, 0 ) + 1;
}

const getChannelForPart = function( partName ) {
  // conventions for midi instruments or mixer channels
  const channel = getChannelConventions()[partName];
  if ( _.isNumber( channel ) ) {
    return channel;
  }

  const partialMatch = _.findKey( getChannelConventions(), ( channel, part ) => {
    return partName.startsWith( part );
  } );
  if ( partialMatch ) {
    return getChannelConventions()[partialMatch];
  }

  return 1;
};

function getChannelForPartOnDeck( partName, deckIndex ) {
  const channel = getChannelForPart( partName );
  return channel + ( deckIndex * getChannelsPerDeck() );
}

export default {
  getChannelForPart,
  getChannelForPartOnDeck,
};
