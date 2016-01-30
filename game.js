var levels, board, currentLevel = 0;
var orb, things, exit;
var spells = [];
var tileSize = 60;
var tileGap = 10;
var halfTile = tileSize / 2;
var tileSpeed = tileSize + tileGap;

function baseObject(op) {
  var obj = {
    x: op.x,
    y: op.y,
    targetX: op.x,
    targetY: op.y,
    speedX: op.speedX,
    speedY: op.speedY,
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
}

function setupLevel() {
  board = levels[currentLevel];
  orb = baseObject({
    x: (board.startX - 1) * tileSpeed,
    y: (board.startY - 1) * tileSpeed,
    speedX: 0,
    speedY: tileSpeed
  });
  exit = {
    x: board.goalX - 1,
    y: board.goalY - 1
  };
  things = board.things.slice().map(baseObject);
  setTimeout(function () {
    setInterval(beatstep, 500);
  }, 100);
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
  rect(beat * tileSpeed, (board.height - 1) * tileSpeed, tileSize, tileSize);
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
}


var beat = 0;

function beatstep() {
  if (beat++ == 3) {
    beat = 0;
  } else {
    return;
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
  mouseDownY = 0;

function mousePressed() {
  mouseDownX = mouseX;
  mouseDownY = mouseY;
}

function mouseReleased() {
  if (mouseDownX > board.width * tileSpeed || mouseDownY > board.height * tileSpeed) {
    return;
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
    x: floor(mouseDownX / tileSpeed) * tileSpeed,
    y: floor(mouseDownY / tileSpeed) * tileSpeed,
    dirX: dirX,
    dirY: dirY
  }
}
