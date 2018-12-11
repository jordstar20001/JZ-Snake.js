// DIRECTION enum

var E_DIRECTION = {
  UP: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,
  data:{
    0:{x:0,y:-1},
    1:{x:-1,y:0},
    2:{x:0,y:1},
    3:{x:1,y:0}
  }
}

var game_width = 15;

var game_height = 15;

var gridSize = 20;

var buffer = 10;

var gameStarted = false;

var dead = false;

// Other game settings (defaults = starting values)

var moveSpeed = 5;

var snakeLength = 3;

var headPositionX = Math.ceil(game_width / 2);

var headPositionY = 3;

var applePositionX = 0;

var applePositionY = 0;

var appleColourChoice = 0;

var moveDir = E_DIRECTION.DOWN;

var bodyArray = new Array();

var applesEaten = 0;

// MAKE SURE THIS FUNCTION IS UPDATED...

function RESETVARS(){
  game_width = 15;

  game_height = 15;

  gridSize = 20;

  buffer = 10;

  gameStarted = false;

  dead = false;

  // Other game settings (defaults = starting values)

  moveSpeed = 10;

  snakeLength = 3;

  headPositionX = Math.ceil(game_width / 2);

  headPositionY = 3;

  applePositionX = 0;

  applePositionY = 0;

  appleColourChoice = 0;

  moveDir = E_DIRECTION.DOWN;

  bodyArray = new Array();

  var applesEaten = 0;
}






function GridToCanvas(x, y){
  if((x > game_width || y > game_height) || (x < 0 || y < 0)){
    return undefined;
  }

  else{
    return {
      "x":x*gridSize,
      "y":y*gridSize
    }
  }
}

function DrawSnake(){
  for(position of bodyArray){
    var canvasPos = GridToCanvas(position.x, position.y);
    if(canvasPos == undefined){
      gameStarted = false;
      setup();
      return;
    }
    fill(0);
    rect(canvasPos.x, canvasPos.y, gridSize, gridSize);
  }
}

function MoveSnake(){
  // The head of the snake is at index [length - 1]
  var head = bodyArray[bodyArray.length - 1];
  var newHeadPosX = head.x + E_DIRECTION.data[moveDir].x;
  var newHeadPosY = head.y + E_DIRECTION.data[moveDir].y;

  if((newHeadPosX <= 0 || newHeadPosX > game_width) || (newHeadPosY <= 0 || newHeadPosY > game_height)){
    return false;
  }

  bodyArray.push({
    x: newHeadPosX,
    y: newHeadPosY
  });


  // REMOVE FINAL BODY BIT.
  bodyArray.shift();

  return true;
}

function NewApple(){
  applePositionX = Math.ceil(Math.random() * game_width);
  applePositionY = Math.ceil(Math.random() * game_height);

  for(pos of bodyArray){
    if(applePositionX == pos.x && applePositionY == pos.y){
      // Try again.
      NewApple();
      return;
    }
  }

  appleColourChoice = Math.random();
}

function DrawApple(){
  var canvasPos = GridToCanvas(applePositionX, applePositionY);

  if(appleColourChoice > 0.5){
    fill(255, 0, 0);
  }

  else{
    fill(0, 255, 0);
  }

  rect(canvasPos.x, canvasPos.y, gridSize, gridSize);

}

function GrowSnake(){
  // The head of the snake is at index [length - 1]
  var head = bodyArray[bodyArray.length - 1];
  var newHeadPosX = head.x + E_DIRECTION.data[moveDir].x;
  var newHeadPosY = head.y + E_DIRECTION.data[moveDir].y;

  bodyArray.push({
    x: newHeadPosX,
    y: newHeadPosY
  });
}

function AteApple(){
  var head = bodyArray[bodyArray.length - 1];
  if(head.x == applePositionX && head.y == applePositionY){
    applesEaten ++;
    return true;
  }

  else{
    return false;
  }
}

function HitSelf(){
  var head = bodyArray[bodyArray.length - 1];
  for(let i = 0; i < bodyArray.length - 2; i++){
    if(bodyArray[i].x == head.x && bodyArray[i].y == head.y){
      // Game over.
      return true;
    }
  }

  return false;
}

function setup(){
  RESETVARS();
  createCanvas(game_width * gridSize + 2*buffer, game_height * gridSize + 2*buffer);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(25);
  rectMode(CENTER);
  frameRate(moveSpeed);
  NewApple();

  // Create body parts.
  for(let i = snakeLength - 1; i >= 1; i--){
    var bodyPartPosX = headPositionX - E_DIRECTION.data[moveDir].x * i;
    var bodyPartPosY = headPositionY - E_DIRECTION.data[moveDir].y * i;
    bodyArray.push({
      x: bodyPartPosX,
      y: bodyPartPosY
    });
  }
// Add head.
  bodyArray.push({
    x: headPositionX,
    y: headPositionY
  });
}

function draw(){
  if(!gameStarted){
    background(200);
    text("Press space to start...", width / 2, height / 2);
    return;
  }

  // Draw a grid

// Columns
  for(var i = 0; i < game_height; i++){
    for(var j = 0; j < game_width; j++){
      stroke(0);
      fill(255);
      rect(j * gridSize + gridSize / 2 + buffer, i * gridSize + gridSize / 2 + buffer, gridSize, gridSize);
    }
  }

  // Returns false if they hit a wall.
  if(!MoveSnake()){
    // Game Over
    gameStarted = false;
    setup();
  }

  if(HitSelf()){
    gameStarted = false;
    setup();
  }



  if(AteApple()){
    GrowSnake();
    DrawSnake();
    NewApple();
    DrawApple();
  }

  else{
    DrawSnake();
    DrawApple();
  }

  // textAlign(CENTER);
  // fill(0);
  // text("YOU HAVE EATEN: " + applesEaten.toString() + "APPLES!", game_height * gridSize + 30, game_width * gridSize / 2);




}

function keyPressed(){
  if(keyCode == 32 && gameStarted == false){
    gameStarted = true;
  }
  else{
    if(keyCode == LEFT_ARROW){
      moveDir = E_DIRECTION.LEFT;
    }
    else if(keyCode == RIGHT_ARROW){
      moveDir = E_DIRECTION.RIGHT;
    }
    else if(keyCode == UP_ARROW){
      moveDir = E_DIRECTION.UP;
    }
    else if(keyCode == DOWN_ARROW){
      moveDir = E_DIRECTION.DOWN;
    }
  }

  if(keyCode == 67){
    noLoop();
  }
  else if(keyCode == 68){
    loop();
  }





}
