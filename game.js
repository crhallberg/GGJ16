var levels, board, currentLevel = 0;
var orb, things, exit;
var spells = [];
var tileSize = 60;
var tileGap = 10;
var halfTile = tileSize / 2;
var tileSpeed = tileSize + tileGap;
var tempo;

function baseObject(op) {
  var obj = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    move: function () {
      if (this.x == this.targetX && this.y == this.targetY) {
        return;
      }
      if (dist(this.x, this.y, this.targetX, this.targetY) < 2) {
        this.x = this.targetX;
        this.y = this.targetY;
      }
      this.x += (this.targetX - this.x) / 4;
      this.y += (this.targetY - this.y) / 4;
    }
  };
  for (var i in op) {
    obj[i] = op[i];
  }
  obj.x *= tileSpeed;
  obj.y *= tileSpeed;
  obj.speedX *= tileSpeed;
  obj.speedY *= tileSpeed;
  obj.targetX = obj.x;
  obj.targetY = obj.y;
  return obj;
}

function preload() {
  loadAllSound();
}


function setup() {
  createCanvas(800, 600);
  noLoop();
  ellipseMode(CORNER);
  load('./levels.json').then(function (json) {
    levels = json.slice();
    setupLevel();
    loop();
  });
  tempo = new Tempo();
  tempo.onBeat(beatstep);
  loopBackgroundMusic("drumchant");
}

function setupLevel() {
  board = levels[currentLevel];
  spells = [];
  orb = baseObject({
    x: board.startX,
    y: board.startY,
    speedX: 0,
    speedY: 1,
    dead: false
  });
  exit = {
    x: board.goalX * tileSpeed,
    y: board.goalY * tileSpeed,
  };
  things = [];
  for (var i = 0; i < board.things.length; i++) {
    things.push(baseObject(board.things[i]));
  }
  tempo.setTempo(71);
  tempo.start(4);
}

function draw() {
  background('brown');
  if (!board) return;
  // Draw grid
  noStroke();
  fill('grey');
  for (var x = 0; x < board.width; x++) {
    for (var y = 0; y < board.height; y++) {
      rect(x * tileSpeed, y * tileSpeed, tileSize, tileSize);
    }
  }
  // BEAT
  fill('white');
  rect(tempo.getBeat() * tileSpeed, 0, tileSize, tileSize);
  // THINGS
  for (var i = 0; i < things.length; i++) {
    // REPLACE WITH IMAGE NAME
    switch (things[i].type) {
    case "gem":
      fill('navy');
      rect(things[i].x, things[i].y, tileSize, tileSize);
      break;
    case "block":
      fill('#432');
      rect(things[i].x, things[i].y, tileSize, tileSize);
      break;
    case "death":
      fill('red');
      rect(things[i].x, things[i].y, tileSize, tileSize);
      break;
    }
  }
  // EXIT
  fill('black');
  ellipse(exit.x, exit.y, tileSize - 1, tileSize - 1);
  // ORB
  if (!orb.dead) {
    fill('yellow');
    orb.move();
    ellipse(orb.x, orb.y, tileSize - 1, tileSize - 1);
  }
  // Spells
  fill('green')
  for (var i = 0; i < spells.length; i++) {
    var dx = spells[i].dirX;
    var dy = spells[i].dirY;
    var theta = HALF_PI * (abs(dx * (dx - 1)) + dy);
    push();
    translate(spells[i].x + halfTile, spells[i].y + halfTile);
    rotate(theta);
    triangle(halfTile, 0, -halfTile, -halfTile, -halfTile, halfTile);
    pop();
  }

  // Things on beat in real time
  for (var i = 0; i < things.length; i++) {
    if (insideRect(orb.x + halfTile, orb.y + halfTile, things[i].x, things[i].y, tileSize, tileSize)) {
      if ('block' == things[i].type) {
        burst(100, 'black');
        burst(20, 'yellow');
        orb.dead = true;
        tempo.pause(3);
      }
    }
  }

  if (mouseIsPressed) {
    addParticle({
      x: mouseX,
      y: mouseY
    })
  }
  drawParticles();
}


function beatstep(beat) {
  if (orb.dead) {
    setupLevel();
    return;
  }
  if (orb.x == exit.x && orb.y == exit.y) {
    currentLevel++;
    setupLevel();
  }
  // Things on beat before spells
  for (var i = 0; i < things.length; i++) {
    if (orb.x == things[i].x && orb.y == things[i].y) {
      if ('death' == things[i].type) {
        burst(100, 'red');
        burst(100, 'black');
        burst(20, 'yellow');
        orb.dead = true;
        tempo.pause(3);
        return;
      }
    }
  }
  // Spells
  for (var i = 0; i < spells.length; i++) {
    if (orb.x == spells[i].x && orb.y == spells[i].y) {
      orb.speedX = spells[i].dirX * tileSpeed;
      orb.speedY = spells[i].dirY * tileSpeed;
      spells.splice(i, 1);
      burst(100, 'green');
    }
  }
  // Things on beat before spells
  for (var i = 0; i < things.length; i++) {}
  if (beat % 2 > 0) {
    return;
  }
  orb.targetX += orb.speedX;
  orb.targetY += orb.speedY;
  // Move things
  for (var i = 0; i < things.length; i++) {
    things[i].x += things[i].speedX;
    things[i].y += things[i].speedY;
  }
  trimParticles();
}

var mouseDownX = 0,
  mouseDownY = 0,
  mouseDownTileX = 0,
  mouseDownTileY = 0;

function mousePressed() {
  mouseDownX = mouseX;
  mouseDownY = mouseY;
  mouseDownTileX = floor(mouseDownX / tileSpeed) * tileSpeed
  mouseDownTileY = floor(mouseDownY / tileSpeed) * tileSpeed
}

function mouseReleased() {
  if (mouseDownX > board.width * tileSpeed || mouseDownY > board.height * tileSpeed) {
    return;
  }
  for (var i = 0; i < things.length; i++) {
    if (things[i].type == "gem" && mouseDownTileX == things[i].x && mouseDownTileY == things[i].y) {
      return;
    }
  }
  for (var i = 0; i < spells.length; i++) {
    if (mouseDownTileX == spells[i].x && mouseDownTileY == spells[i].y) {
      spells[i] = spellDirection();
      burst(20, 'green', spells[i].x + halfTile, spells[i].y + halfTile);
      return;
    }
  }
  spells.push(spellDirection());
  burst(20, 'green', spells[i].x + halfTile, spells[i].y + halfTile);
}

function spellDirection() {
  var diffX = mouseX - mouseDownX;
  var diffY = mouseY - mouseDownY;
  var dirX = 0;
  var dirY = 0;
  if (abs(diffX) > abs(diffY)) {
    dirX = diffX > 0 ? 1 : -1;
    dirY = 0;
  } else {
    dirX = 0;
    dirY = diffY > 0 ? 1 : -1;
  }
  return {
    x: mouseDownTileX,
    y: mouseDownTileY,
    dirX: dirX,
    dirY: dirY
  }
}

function insideRect(x, y, rx, ry, rw, rh) {
  return x > rx && x < rx + rw && y > ry && y < ry + rh;
}
