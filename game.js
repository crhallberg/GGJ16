var levels, board, currentLevel = 0;
var orb, things, exit;
var spells = [];
var tileSize = 75;
var tileGap = 3;
var halfTile = tileSize / 2;
var tileSpeed = tileSize + tileGap;
var tempo;
var img_tile, img_fire, img_ice, img_exit, img_death, img_enemy, img_void, img_ice_shot;
var imgs_orb = [];

function baseObject(op, absolute) {
  var obj = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    move: function () {
      this.targetX += this.speedX;
      this.targetY += this.speedY;
    },
    tween: function () {
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
  if (!absolute) {
    obj.x *= tileSpeed;
    obj.y *= tileSpeed;
    obj.speedX *= tileSpeed;
    obj.speedY *= tileSpeed;
  }
  obj.targetX = obj.x;
  obj.targetY = obj.y;
  return obj;
}

function preload() {
  loadAllSound();
  img_death = loadImage('./assets/art/DANGER.png');
  img_enemy = loadImage('./assets/art/ENEMY.png');
  img_exit = loadImage('./assets/art/EXIT.png');
  img_fire = loadImage('./assets/art/FIRE.png');
  img_ice = loadImage('./assets/art/ICE.png');
  img_ice_shot = loadImage('./assets/art/ICE_PROJ.png');
  img_tile = loadImage('./assets/art/STONE.png');
  img_void = loadImage('./assets/art/NOSPELL.png');
  imgs_orb.push(loadImage('./assets/art/BALL_BOTTOM.png'));
  imgs_orb.push(loadImage('./assets/art/BALL_MED.png'));
  imgs_orb.push(loadImage('./assets/art/BALL_SPARK_1.png'));
  imgs_orb.push(loadImage('./assets/art/BALL_SPARK_2.png'));
  imgs_orb.push(loadImage('./assets/art/BALL_TOP.png'));
}

function setup() {
  createCanvas(1000, 1000);
  noLoop();
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
    speedY: 0,
    dead: false,
    fire: false
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

  resizeCanvas(board.width * tileSpeed, windowHeight);
}

function die() {
  orb.dead = true;
  tempo.pause(3);
}

function draw() {
  background('#9f7764');
  if (!board) return;
  // Draw grid
  noStroke();
  fill('grey');
  for (var x = 0; x < board.width; x++) {
    for (var y = 0; y < board.height; y++) {
      image(img_tile, x * tileSpeed, y * tileSpeed, tileSize, tileSize);
    }
  }
  /*/ BEAT
  fill('white');
  rect(tempo.getBeat() * tileSpeed, 0, tileSize, tileSize);
  //*/
  // THINGS
  for (var i = 0; i < things.length; i++) {
    // REPLACE WITH IMAGE NAME
    switch (things[i].type) {
    case "void":
      image(img_void, things[i].x, things[i].y, tileSize, tileSize);
      break;
    case "fire":
      image(img_fire, things[i].x, things[i].y, tileSize, tileSize);
      break;
    case "ice":
      image(img_ice, things[i].x, things[i].y, tileSize, tileSize);
      break;
    case "ice_burst":
      push();
      imageMode(CENTER);
      translate(things[i].x + halfTile, things[i].y + halfTile);
      rotate(frameCount / 20);
      image(img_ice_shot, 0, 0, tileSize-20, tileSize-10);
      pop();
      imageMode(CORNER);
      break;
    case "death":
      image(img_death, things[i].x, things[i].y, tileSize, tileSize);
      break;
    case "enemy":
      var dx = things[i].speedX / tileSpeed;
      var dy = things[i].speedY / tileSpeed;
      var theta = HALF_PI * (abs(dx * (dx - 1)) + dy);
      if (dx + dy == 0) {
        theta = HALF_PI;
      }
      push();
      imageMode(CENTER);
      translate(things[i].x + halfTile, things[i].y + halfTile);
      rotate(theta);
      image(img_enemy, 0, 0, tileSize, tileSize);
      imageMode(CORNER);
      pop();
      break;
    }
  }
  // EXIT
  image(img_exit, exit.x, exit.y, tileSize, tileSize);
  // ORB
  if (!orb.dead) {
    orb.tween();
    push();
    translate(orb.x + halfTile, orb.y + halfTile);
    imageMode(CENTER);
    if (orb.fire) {
      fill('red');
      ellipse(0, 0, tileSize, tileSize);
    }
    var theta = frameCount / 40;
    for (var i = 0; i < imgs_orb.length; i++) {
      rotate(theta);
      theta *= -1.5;
      image(imgs_orb[i], 0, 0, tileSize + 25, tileSize + 25);
    }
    pop();
    imageMode(CORNER);
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
    things[i].tween();
    if (insideRect(orb.x + halfTile, orb.y + halfTile, things[i].x, things[i].y, tileSize, tileSize)) {
      if ('block' == things[i].type) {
        burst(100, 'black');
        burst(20, 'yellow');
        die();
      }
    }
  }
  if (!orb.dead && !insideRect(orb.x + halfTile, orb.y + halfTile, 0, 0, tileSpeed * board.width, tileSpeed * board.height)) {
    burst(100, 'brown');
    burst(100, 'yellow');
    die();
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
    if (things[i].skip) {
      things[i].skip = false;
      continue;
    }
    if (orb.x == things[i].x && orb.y == things[i].y)
    {
      if ('death' == things[i].type || 'enemy' == things[i].type)
      {
        burst(100, 'red');
        burst(100, 'black');
        if (orb.fire) {
          orb.fire = false;
          things[i].delete = true;
        } else {
          burst(20, 'yellow');
          die();
          return;
        }
      } else if (!orb.fire && 'fire' == things[i].type) {
        burst(100, 'orange');
        burst(100, 'red');
        orb.fire = true;
        things[i].skip = true;
      } else if ('ice' == things[i].type) {
        burst(100, 'blue');
        burst(100, 'navy');
        var ib = baseObject({
          x: orb.x,
          y: orb.y,
          speedX: orb.speedX,
          speedY: orb.speedY,
          type: 'ice_burst'
        }, true);
        things.push(ib);
        orb.speedX *= -1;
        orb.speedY *= -1;
        things[i].skip = true;
      }
    } else if ('ice_burst' == things[i].type)
    {
      for (var j = 0; j < i; j++) {
        if (
          ('death' == things[j].type || 'enemy' == things[j].type)
          && things[i].x == things[j].x && things[i].y == things[j].y
        ) {
          burst(100, 'red', things[i].x + halfTile, things[i].y + halfTile);
          burst(50, 'white', things[i].x + halfTile, things[i].y + halfTile);
          burst(100, 'black', things[i].x + halfTile, things[i].y + halfTile);
          things[i].delete = true;
          things[j].delete = true;
        }
      }
    } else if ('enemy' == things[i].type)
    {
      if (orb.x == things[i].x) {
        var diff = orb.y - things[i].y;
        diff /= abs(diff);
        things[i].speedX = 0;
        things[i].speedY = diff * tileSpeed;
      } else if (orb.y == things[i].y) {
        var diff = orb.x - things[i].x;
        diff /= abs(diff);
        things[i].speedX = diff * tileSpeed;
        things[i].speedY = 0;
      }
      if (
        (things[i].x == 0 && things[i].speedX < 0)
        || (things[i].y == 0 && things[i].speedY < 0)
        || (things[i].speedX > 0 && things[i].x == board.width * tileSpeed)
        || (things[i].speedY > 0 && things[i].y == board.height * tileSpeed)
      ) {
        things[i].speedX = 0;
        things[i].speedY = 0;
      }
      for (var j = 0; j < things.length; j++) {
        if (i == j) continue;
        if (things[i].x == things[j].x && things[i].y == things[j].y) {
          if ('fire' == things[j].type) {
            burst(50, 'gray', things[i].x, things[i].y);
            burst(20, 'red', things[i].x, things[i].y);
            burst(50, 'lime', things[i].x, things[i].y);
            burst(50, 'black', things[i].x, things[i].y);
            things[i].delete = true;
          } else if ('void' == things[j].type) {
            burst(50, 'gray', things[i].x, things[i].y);
            burst(50, 'white', things[i].x, things[i].y);
            burst(50, 'lightblue', things[i].x, things[i].y);
            things[i].delete = true;
          }
          } else if ('void' == things[j].type) {
            burst(50, 'gray', things[i].x, things[i].y);
            things[i].delete = true;
          }
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
  things = things.filter(function (op) {
    return !op.delete;
  });
  /*
    if (beat % 2 > 0) {
      return;
    }
    //*/
  orb.move();
  // Move things
  for (var i = 0; i < things.length; i++) {
    things[i].move();
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
    if (
      ("void" == things[i].type || "ice" == things[i].type)
      && mouseDownTileX == things[i].x && mouseDownTileY == things[i].y) {
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

function keyPressed() {
  if (key == 'r' || key == 'R') {
    setupLevel();
  }
}
