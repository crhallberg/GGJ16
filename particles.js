function Particle(ops) {
  this.x = ops.x-1;
  this.y = ops.y-1;
  this.speedX = (ops.speedX || 0) + random(-1, 1);
  this.speedY = (ops.speedY || 0) + random(-1, 1);
  this.color = ops.color || '#fff';
  this.life = ops.life || 45;
  this.behave = ops.behave || false;
  this.draw = function() {
    if (this.life == 0) {
      return;
    }
    if (this.behave) {
      this.behave();
      return;
    }
    if (this.life > 0) {
      this.life --;
    }
    fill(this.color);
    rect(this.x, this.y, 3, 3);
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

var particles = [];
function addParticle(ops) {
  particles.push(new Particle(ops));
}
function drawParticles() {
  for (var i=0; i<particles.length; i++) {
    particles[i].draw();
  }
}
