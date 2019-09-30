
class NotePattern {
  constructor( options ) {
    options = options || {};
    this.duration = options.duration || 4;
    this.notes = options.notes || [
      { start: 0, duration: 1, note: 42, velocity: 100, },
      { start: 1, duration: 1, note: 42, velocity: 100, },
      { start: 2, duration: 1, note: 42, velocity: 100, },
      { start: 3, duration: 1, note: 42, velocity: 100, },
    ];

    this.startBeats = options.startBeats || [ 0, ];
    this.endBeats = options.endBeats || [ 0, ];
  }
}

export default NotePattern;
