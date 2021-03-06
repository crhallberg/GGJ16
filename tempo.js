/**
 * this.onBeat (function) - set the behavior. function will receive the beat number (1-4) as a parameter
 *
 * this.setTempo(bpm) - set the tempo with a number of BPM
 *
 * this.start (delay) - will start the beat after a delay in number of beats
 *
 * this.resync() - restart the beat and beat count
 *
 * this.pause(beats) - stop looping for x beats
 *
 * this.stop() - stop the press!
 */
function Tempo() {
  this.tempo = 60;
  this.loop = false;
  this.beat = -1;
  this.measure = 4;
  this.beatEvent = false;
  this.skip = 0;

  // Return beat (in index 1)
  this.getBeat = function() {
    return this.beat + 1;
  }
  // Pause for x beats
  this.pause = function(beats) {
    this.skip = beats-1;
  }
  // Set BPM tempo
  this.setTempo = function(bpm) {
    this.tempo = 60000/bpm;
  };
  // Private
  this.beginLoop = function() {
    if (this.loop) {
      clearInterval(this.loop);
    }
    this.loop = setInterval((function() {
      if (this.skip > 0) {
        this.skip --;
        return;
      }
      this.beat = (this.beat + 1) % this.measure;
      this.beatEvent(this.beat + 1);
    }).bind(this), this.tempo);
  }
  // Reset the beat and reset the loop
  this.resync = function() {
    if (typeof this.beatEvent !== 'function') {
      return;
    }
    this.beat = 0;
    this.beginLoop();
  };
  // Let's do this!
  this.start = function(delay) {
    this.stop();
    if ('undefined' == typeof delay) {
      delay = 1;
    }
    this.beat = -1;
    this.skip = delay-1;
    this.beginLoop();
  }
  // ...nevermind!
  this.stop = function() {
    if (this.loop) {
      clearInterval(this.loop);
    }
  }
  // set a function to perform on the beat
  // function(beat) { }
  this.onBeat = function(func) {
    this.beatEvent = func;
  };
}
