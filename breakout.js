let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let x = canvas.width/2;
let y = canvas.height-30;

let dx = 4;
let dy = -4;

const ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 60;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 4;
let brickColumnCount = 7;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 0;
let brickOffsetTop = 30;
let brickOffsetLeft = 0;
let bricks = [];

let score = 0;
let runningScore = 0;
let lives = 3;

let hit = new sound("blip.wav");
let death = new sound("death.wav");
let win = new sound("level-up.wav");
let loss = new sound("loss.wav")

for (let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for (let r=0; r<brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#ff3105";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#14a90a";
    ctx.fill();
    ctx.closePath();
}


function drawBricks() {
    for (let c=0; c<brickColumnCount; c++) {
        for (let r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (r == 0) {
                    ctx.fillStyle = "#05d620";
                    ctx.fill();
                }
                if (r == 1) {
                    ctx.fillStyle = "#950495";
                    ctx.fill();
                }
                if (r == 2) {
                    ctx.fillStyle = "#dbd900";
                    ctx.fill();
                }
                if (r == 3) {
                    ctx.fillStyle = "#0030e0";
                    ctx.fill();
                }
                if (r == 4) {
                    ctx.fillStyle = "#fe7e1b";
                    ctx.fill();
                }
                if (r == 5) {
                    ctx.fillStyle = "#1bfef4";
                    ctx.fill();
                }
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c=0; c<brickColumnCount; c++) {
        for (let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    runningScore++;
                    hit.play();
                    if (runningScore % 10 == 0) {
                        lives++;
                    }
                    if (score == brickRowCount*brickColumnCount) {
                        win.play();
                        alert("VICTORY");
                        x = canvas.width/2;
                        y = canvas.height-30;
                        paddleX = (canvas.width-paddleWidth)/2;
                        reload();
                    }
                }
            }
        }
    }
}

function reload() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score = 0;
    for (let c=0; c<brickColumnCount; c++) {
        for (let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            b.status = 1; 
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " +score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-75, 20);
}

function drawHiScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("High Score: " +runningScore, canvas.width/2.5, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawHiScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        hit.play();
    }
    if (y + dy < ballRadius ) {
        dy = -dy;
        hit.play();
    } 
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            hit.play();
        }
        else {
            lives--;
            if (lives != 0) {
                loss.play();
            }
            if (!lives) {
                death.play();
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if (rightPressed) {
        paddleX += 4;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= 4;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    if (runningScore % 50 == 0 && runningScore != 0) {
        dx = 5;
        dy = -5;
    }
  
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function removeButton() {
    button = document.getElementById("play");
    win.play();
    button.style.display = "none";
    canvas.style.border = "1px solid lightseagreen";
}