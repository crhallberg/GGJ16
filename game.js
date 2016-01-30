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
}

function setupLevel() {
  board = levels[currentLevel];
  orb = baseObject({
    x: board.startX,
    y: board.startY,
    speedX: 0,
    speedY: 1
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
  tempo.start(1000);
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
    if (things[i].type == "stone") {
      fill('#543');
      rect(things[i].x, things[i].y, tileSize, tileSize);
    }
  }
  // EXIT
  fill('black');
  ellipse(exit.x, exit.y, tileSize - 1, tileSize - 1);
  // ORB
  fill('yellow');
  orb.move();
  ellipse(orb.x, orb.y, tileSize - 1, tileSize - 1);
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
  if (mouseIsPressed) {
    addParticle({x:mouseX, y:mouseY})
  }
  drawParticles();
}


function beatstep(beat) {
  if (beat > 1) {
    return;
  }
  if (orb.x == exit.x && orb.y == exit.y) {
    alert("WIN");
  }
  // Spells
  for (var i = 0; i < spells.length; i++) {
    if (orb.x == spells[i].x && orb.y == spells[i].y) {
      orb.speedX = spells[i].dirX * tileSpeed;
      orb.speedY = spells[i].dirY * tileSpeed;
      spells.splice(i, 1);
    }
  }
  orb.targetX += orb.speedX;
  orb.targetY += orb.speedY;
  // Move things
  for (var i = 0; i < things.length; i++) {
    things[i].x += things[i].speedX;
    things[i].y += things[i].speedY;
  }
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
  for (var i=0; i<things.length; i++) {
    if (things[i].type == "stone"
        && mouseDownTileX == things[i].x && mouseDownTileY == things[i].y) {
      return;
    }
  }
  spells.push(spellDirection());
  console.log(spells);
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
