# Kytaime Throwdown
Browser-based MIDI and audio sequencer

This is a .. rewrite. Completely new, borrows some code from `master` (but there's no common ancestor to these branches). Will overwrite master when this proof of concept is working well and I can do some jamming with it.

*Kytaime* is the core sequencing library.

*Throwdown* is a midi & audio jamming tool for me to play with :)

#### Why a rewrite
The previous code was very old and had a lot of dependencies that needed updating. The react code for handling the audio sequencing used deprecated react APIs.

This rewrite is an attempt to implement accurate audio & midi pattern sequencing with a react UI, up-to-date libs (in particular react, redux and webpack), and redux-based one-way dataflow for sequencer/song state.

The feature driving this rewrite (and project generally) is the ability for an individual part of the song – e.g. a pattern, or a scene (aka arrangement section) to send an event/message/action to stop itself, or start another pattern, or change the tempo, and to have this action take effect at the appropriate time (e.g. at the end of the pattern/section).
