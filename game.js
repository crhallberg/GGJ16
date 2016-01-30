var levels, board, currentLevel = 0;
var orb, things, exit;
var spells = [];
var tileSize = 60;

function setup() {
  createCanvas(800, 600);
  noLoop();
  ellipseMode(CORNER);
  load('./levels.json').then(function (json) {
    levels = json.slice();
    console.log(levels);
    setupLevel();
    loop();
  });
}

function setupLevel() {
  board = levels[currentLevel];
  orb = {
    x: board.startX - 1,
    y: board.startY - 1,
    speedX: 0,
    speedY: 1
  };
  exit = {
    x: board.goalX - 1,
    y: board.goalY - 1
  };
  things = board.things.slice();
  setTimeout(function() {
    setInterval(beatstep, 500);
  }, 2000);
}

function draw() {
  background('brown');
  if (!board) return;
  // Draw grid
  fill('grey');
  for (var x = 0; x < board.width; x++) {
    for (var y = 0; y < board.height; y++) {
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
  // BEAT
  fill('white');
  rect(beat * tileSize, (board.height-1)*tileSize, tileSize, tileSize);
  // ORB
  fill('yellow');
  noStroke();
  ellipse(orb.x*tileSize, orb.y*tileSize, tileSize-1, tileSize-1);
  // Spells
  fill('green')
  for (var i=0; i<spells.length; i++) {
    var dx = spells[i].dirX;
    var dy = spells[i].dirY;
    var theta = HALF_PI * (abs(dx*(dx-1)) + dy);
    push();
    translate(spells[i].x*tileSize + tileSize/2, spells[i].y*tileSize + tileSize/2);
    rotate(theta);
    triangle(tileSize/2, 0, -tileSize/2, -tileSize/2, -tileSize/2, tileSize/2);
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
  for (var i=0; i<spells.length; i++) {
    console.log(orb.x, spells[i].x);
    if (orb.x == spells[i].x && orb.y == spells[i].y) {
      orb.speedX = spells[i].dirX;
      orb.speedY = spells[i].dirY;
      spells.splice(i, 1);
    }
  }
  orb.x += orb.speedX;
  orb.y += orb.speedY;
  // Move things
  for (var i=0; i<things.length; i++) {
    things[i].x += things[i].speedX;
    things[i].y += things[i].speedY;
  }
}

var mouseDownX = 0,
    mouseDownY = 0;
function mousePressed() {
  console.log('mP');
  mouseDownX = mouseX;
  mouseDownY = mouseY;
}
function mouseReleased() {
  console.log('mR');
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
    x: floor(mouseDownX/tileSize),
    y: floor(mouseDownY/tileSize),
    dirX: dirX,
    dirY: dirY
  }
}
