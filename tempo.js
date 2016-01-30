function Tempo() {
  this.tempo = 60;
  this.loop = false;
  this.beat = -1;
  this.measure = 4;
  this.beatEvent = false

  this.getBeat = function() {
    return this.beat + 1;
  }
  this.setTempo = function(bpm) {
    this.tempo = 60000/bpm;
    console.log(this.tempo)
  };
  this.beginLoop = function() {
    if (this.loop) {
      clearInterval(this.loop);
    }
    this.loop = setInterval((function() {
      this.beat = (this.beat + 1) % this.measure;
      this.beatEvent(this.beat + 1);
    }).bind(this), this.tempo);
  }
  this.resync = function() {
    console.log('rs');
    if (typeof this.beatEvent !== 'function') {
      return;
    }
    this.beat = 0;
    this.beginLoop();
  };
  this.start = function(delay) {
    if ('undefined' == typeof delay) {
      delay = 1;
    }
    var that = this;
    this.beat = -1;
    setTimeout((function() {
      this.beat = -1;
      this.beginLoop();
    }).bind(this), delay);
  }
  this.stop = function() {
    if (this.loop) {
      clearInterval(this.loop);
    }
  }
  this.onBeat = function(func) {
    console.log(typeof func)
    this.beatEvent = func;
  };
}
