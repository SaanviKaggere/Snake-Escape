
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;

var frog, frog1, frog2, frog3;
var backgroundImage;
var snake, snakesGroup;

function preload() {
  frogDied = loadAnimation("frogDiedAnimation.png");
  frogRunning = loadAnimation("frogAnimation2.png", "frogAnimation3.png", "frogAnimation1.png");

  snakeImg = loadImage("snake.png");

  backgroundImage = loadImage("forestBackground.jpg");
  gameOverImg = loadImage("gameOver.png");
  restartButton = loadImage("restart.png");

  jumpSound = loadSound("Jump-Sound.mp3");
  bgMusic = loadSound("bgMusic.mp3");
  dieSound = loadSound("dieSound.mp3");

}
function setup() {
  createCanvas(1000, 600);
  background("blue");

  engine = Engine.create();
  world = engine.world;

  bgMusic.play();

  muteButton = createImg('muteButton.png');
  muteButton.position(50,30);
  muteButton.size(60,60);
  muteButton.mouseClicked(mute);

  frog = createSprite(100, 300, 50, 50);
  //frog.addImage(frog1);
  frog.addAnimation("running", frogRunning);
  frog.addAnimation("died", frogDied);
  frog.scale = 1.5;

  ground = createSprite(400, 490, 900, 10);
  ground.x = ground.width / 2;
  ground.visible = false;

  gameOver = createSprite(500, 255, 70, 70);
  gameOver.addImage(gameOverImg);

  restart = createSprite(500, 320, 60, 60)
  restart.addImage(restartButton);
  restart.scale = 0.2


  snakesGroup = createGroup();

  score = 0;


}


function draw() {
  background(backgroundImage);
  Engine.update(engine);
  textSize(30);
  fill("white");
  text("Score: " + score, 800, 70);


  if (gameState === PLAY) {


    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (ground.x < 350) {
      ground.x = ground.width / 2;
    }

    //add gravity
    frog.velocityY = frog.velocityY + 1
    frog.collide(ground);

    snakesAppear();

    //Make frog jump
    if (keyDown("space") && frog.y >= 300) {
      frog.velocityY = -10;
      jumpSound.play();
    }

  if (snakesGroup.isTouching(frog)) {
    dieSound.play();
    gameState = END;
  }
    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    bgMusic.stop();

    frog.changeAnimation("died", frogDied);
    ground.velocityX = 0;
    frog.velocityY = 0;

    snakesGroup.setLifetimeEach(-1);
    snakesGroup.setVelocityXEach(0);
  }

  if (mousePressedOver(restart)) {
    reset();
  }

  drawSprites();
}

function snakesAppear(){
if(frameCount % 150 === 0) {
  console.log("test");
var snake = createSprite(1000, 465, 70, 20);
snake.velocityX = -4;
snake.addImage(snakeImg);
snake.scale = 0.5;

snake.lifetime = 200;

snakesGroup.add(snake);
}
}

// function snakesAppear() {
//   if (World.frameCount % 60 === 0) {
//     var snake = createSprite(600, 500, 40, 10);
//     snake.x = Math.round(random(200, 300));
//     snake.addImage(snakeImg);
//     snake.scale = 0.5;
//     snake.velocityX = -2;

//     snake.lifetime = 300;

//     snakesGroup.add(snake);
//   }
// }

function reset() {
  snakesGroup.destroyEach();
  score = 0;
  frog.changeAnimation("running", frogRunning);
  gameState = PLAY;
}


function mute()
{
  if(bgMusic.isPlaying())
  {
    bgMusic.stop();
  }
  else{
    bgMusic.play();
  }
}