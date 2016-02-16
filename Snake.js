/**
 * Created by kshitiz on 2/16/16.
 */

/*****CONSTANTS*****/
//SIZE OF GRID
var ROW = 26;
var COL = 26;

//DIRECTION KEYS
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

//DIRECTIONS
var DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

//COLLISION TYPE
var COLLISION_TYPE = {
  FOOD: 1,
  WALL: 2,
  SELF: 3
};

//GRID VALUES
var GRID_VAL = {
  EMPTY: 0,
  SNAKE: 1,
  FOOD: 2
};

//POINT CLASS
var Point = function (x, y) {
  this.x = x;
  this.y = y;
};
/**
 * Compares two points, returns true if equal else false
 * @param point
 * @returns {boolean}
 */
Point.prototype.compare = function (point) {
  if (this.x == point.x && this.y == point.y) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a point is within the game screen
 * @param point
 * @returns {boolean}
 */
Point.prototype.checkInScreen = function () {
  if (this.x >= ROW || this.y >= COL ||
      this.x < 0 || this.y < 0
  ) {
    return false;
  } else {
    return true;
  }
};

//SNAKE CLASS
var Snake = function (point, ctx) {
  this.currDir = DIRECTION.RIGHT;
  this.snakeArr = [];
  this.ctx = ctx;
  this.snakeColorFirst = 'white';
  this.snakeColorSecond = 'white';
  this.snakeArr.push(new Point(point.x, point.y));
};

Snake.prototype.getHead = function () {
  var snakeLength = this.snakeArr.length;
  var snakeHead = this.snakeArr[snakeLength - 1];
  return snakeHead;
};

Snake.prototype.changeDir = function (direction) {
  var snakeLength = this.snakeArr.length;
  var snakeHead = this.snakeArr[snakeLength - 1];

  switch (direction) {
    case DIRECTION.UP:
      if (this.currDir != DIRECTION.DOWN) {
        this.currDir = DIRECTION.UP;
      }
      break;

    case DIRECTION.DOWN:
      if (this.currDir != DIRECTION.UP) {
        this.currDir = DIRECTION.DOWN;
      }
      break;

    case DIRECTION.LEFT:
      if (this.currDir != DIRECTION.RIGHT) {
        this.currDir = DIRECTION.LEFT;
      }
      break;
    case DIRECTION.RIGHT:
      if (this.currDir != DIRECTION.LEFT) {
        this.currDir = DIRECTION.RIGHT;
      }
      break;
    default :
      break;
  }
};

Snake.prototype.crawl = function () {
  var snakeLength = this.snakeArr.length - 1;
  var snakeHead = this.snakeArr[snakeLength];

  switch (this.currDir) {
    case DIRECTION.UP:
      this.currDir = DIRECTION.UP;
      this.snakeArr.push(new Point(snakeHead.x, snakeHead.y - 1));
      this.snakeArr.splice(0, 1);
      break;

    case DIRECTION.DOWN:
      this.currDir = DIRECTION.DOWN;
      this.snakeArr.push(new Point(snakeHead.x, snakeHead.y + 1));
      this.snakeArr.splice(0, 1);
      break;

    case DIRECTION.LEFT:
      this.currDir = DIRECTION.LEFT;
      this.snakeArr.push(new Point(snakeHead.x - 1, snakeHead.y));
      this.snakeArr.splice(0, 1);
      break;

    case DIRECTION.RIGHT:
      this.currDir = DIRECTION.RIGHT;
      this.snakeArr.push(new Point(snakeHead.x + 1, snakeHead.y));
      this.snakeArr.splice(0, 1);
      break;
    default :
      break;
  }
};

//Draws the snake on the canvas
Snake.prototype.drawSnake = function () {
  for (var i = 0; i < mySnake.snakeArr.length; i++) {
    var currPoint = mySnake.snakeArr[i];
    if(i%2 == 0)
      this.ctx.fillStyle = this.snakeColorFirst;
    else
      this.ctx.fillStyle = this.snakeColorSecond;
    this.ctx.fillRect(currPoint.x * tileSize, currPoint.y * tileSize, tileSize, tileSize);
  }
};

Snake.prototype.grow = function () {
  var snakeTail = this.snakeArr[0];
  switch (this.currDir) {
    case DIRECTION.UP:
      this.snakeArr.unshift(new Point(snakeTail.x, snakeTail.y + 1));
      break;
    case DIRECTION.DOWN:
      this.snakeArr.unshift(new Point(snakeTail.x, snakeTail.y - 1));
      break;
    case DIRECTION.LEFT:
      this.snakeArr.unshift(new Point(snakeTail.x + 1, snakeTail.y));
      break;
    case DIRECTION.RIGHT:
      this.snakeArr.unshift(new Point(snakeTail.x - 1, snakeTail.y));
      break;
  }
};

Snake.prototype.didSelfCollide = function () {
  var snakeLength = this.snakeArr.length;
  var snakeHead = this.snakeArr[snakeLength - 1];

  for (var i = snakeLength - 4; i >= 0; i--) {
    if (snakeHead.x == this.snakeArr[i].x && snakeHead.y == this.snakeArr[i].y) {
      return true;
    }
  }
  return false;
};

Snake.prototype.collide = function (collisionType) {
  if (!collisionType) return;
  switch (collisionType) {
    case COLLISION_TYPE.FOOD:
      this.grow();
      break;
    case COLLISION_TYPE.WALL:
    case COLLISION_TYPE.SELF:
      break;
    default :
      break;
  }
};


var Food = function (ctx) {
  this.location = null;
  this.ctx = ctx;
  this.cookFood = function () {
    var x = Math.round(Math.random() * (ROW - 1));
    var y = Math.round(Math.random() * (COL - 1));
    this.location = new Point(x, y);
  };

  this.isFoodPresent = function () {
    if (this.location == null) {
      return false;
    } else {
      return true;
    }
  };

  this.drawFood = function drawFood() {
    if (this.location == null) return;
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.location.x * tileSize, this.location.y * tileSize, tileSize, tileSize);
  };

  this.removeFood = function () {
    this.location = null;
  }

};

/*
 var GameGrid = function (width, height) {
 this.width = width;
 this.height = height;
 this.grid = [];
 for (var i = 0; i < this.width; i++) {
 this.grid[i] = [];
 for (var j = 0; j < this.height; j++) {
 this.grid[i][j] = GRID_VAL.EMPTY;
 }
 }
 };

 GameGrid.prototype.initGrid = function () {
 //for();
 };

 GameGrid.prototype.get = function (point) {
 return this.grid[point.x][point.y];
 };

 GameGrid.prototype.set = function (point) {
 this.grid[point.x][point.y] = 1;
 };

 GameGrid.prototype.unSet = function (point) {
 this.grid[point.x][point.y] = 0;
 };
 */


function listenSnakeMovement() {
  document.onkeydown = function (e) {
    var key = e.keyCode;

    if (key == KEY_LEFT) {
      setTimeout(mySnake.changeDir(DIRECTION.LEFT), 30);
    } else if (key == KEY_UP) {
      setTimeout(mySnake.changeDir(DIRECTION.UP), 30);
    } else if (key == KEY_RIGHT) {
      setTimeout(mySnake.changeDir(DIRECTION.RIGHT), 30);
    } else if (key == KEY_DOWN) {
      setTimeout(mySnake.changeDir(DIRECTION.DOWN), 30);
    }
    if (key) e.preventDefault();
  }
}

function handleCollision() {
  //if (food && food.location && food.location.x == mySnake.getHead().x
  //    && food.location.y == mySnake.getHead().y) {
  if (food && food.isFoodPresent() && food.location.compare(mySnake.getHead())) {
    mySnake.collide(COLLISION_TYPE.FOOD);
    score++;
    updateScore();
    food.removeFood();
    return;
  }

  //Collision with side walls
  //if (mySnake.getHead().x >= ROW || mySnake.getHead().y >= COL ||
  //    mySnake.getHead().x < 0 || mySnake.getHead().y < 0) {
  if (!mySnake.getHead().checkInScreen()) {
    displayMsg = '' + msgObj.GAME_OVER;
    gameOver();
    clearInterval(gameThread);
    return;
  }

  //Collision with snake itself
  if (mySnake.didSelfCollide()) {
    displayMsg = '' + msgObj.SELF_COLLIDE + '\n';
    displayMsg += msgObj.GAME_OVER;
    gameOver();
    clearInterval(gameThread);
  }
}


