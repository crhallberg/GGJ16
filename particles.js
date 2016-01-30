function Particle(ops) {
  this.x = ops.x-1;
  this.y = ops.y-1;
  this.speedX = (ops.speedX || 0) + random(-1, 1);
  this.speedY = (ops.speedY || 0) + random(-1, 1);
  this.color = ops.color || '#fff';
  this.life = floor(ops.life || random(40, 50));
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
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.life = 0;
    }
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
function trimParticles() {
  particles = particles.filter(function(op) {
    return this.life != 0;
  })
}
function burst(number, color, x, y) {
  for (var i = 0; i < number; i++) {
    var a = random(0, TWO_PI);
    var s = random(0, 5);
    addParticle({
      color: color,
      x: x || orb.x + halfTile,
      y: y || orb.y + halfTile,
      speedX: cos(a) * s,
      speedY: sin(a) * s,
      life: random(45, 100)
    })
  }
}
