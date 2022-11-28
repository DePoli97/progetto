/**
 * Web Atelier 2022 3 - Object-Oriented JavaScript
 *
 * ObjectSnake Game
 *
 * Student _Deidda Paolo_
 *
 */

//--------------------------------------------------------------------------------------
// Game
//--------------------------------------------------------------------------------------

class Game {

    /* Quiz 1 */
    #score = 0;
    #health = 0;

    /* Quiz 2 */
    constructor(player) {

        /* Quiz 3 */
        this.running = false;
        this.player = player;

        /* Quiz 4 */
        this.displayPlayer(player);
    }

    /* Quiz 5 */
    startGame() {
        this.running = true;
        this.score = 0;
        this.health = 100;
        this.time = performance.now();
        /* Quiz 6 */
        this.timer = setInterval(this.timer_tick.bind(this), 10);
    }

    stopGame() {
        this.running = false;
        clearInterval(this.timer);

        document.dispatchEvent(new CustomEvent("game.over", {
            detail:
            /* Quiz 7 */
            {
                player: this.player,
                score: this.score,
                time: this.getElapsedTime()
            }
        }));
    }

    getElapsedTime() {
        return (performance.now() - this.time) / 1000;
    }

    timer_tick() {
        this.displayTime(this.getElapsedTime())
    }

    /* Quiz 8 */
    set score(s) {
        this.#score = s;

        this.displayScore(s);

        document.dispatchEvent(new CustomEvent("game.score", { detail: { score: this.score } }));
    }

    /* Quiz 9 */
    get score() {
        return this.#score;
    }

    set health(h) {
        this.#health = h;

        if (this.health <= 0) {

            this.stopGame();

        }

        this.displayHealth(h);

        /* Quiz 10 */
        document.dispatchEvent(new CustomEvent("game.health", { detail: { health: this.health } }));
    }

    get health() {
        return this.#health;
    }

    /* Quiz 11 */
    displayScore(s) {
        document.querySelector(".score span").innerHTML = (s < 0 ? "-" : "") + String(Math.round(Math.abs(s))).padStart(6, '0');
    }

    displayHealth(s) {
        document.querySelector(".health span").innerHTML = Math.round(s) + "%";
    }

    displayPlayer(s) {
        document.querySelector(".player span").innerHTML = s;
    }

    displayTime(s) {
        document.querySelector(".time span").innerHTML = format_seconds(s);
    }

}

//--------------------------------------------------------------------------------------
// CanvasGame
//--------------------------------------------------------------------------------------

class CanvasGame extends Game {

    constructor(player, canvas) {
        /* Quiz 12 */
        super(player)

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");
    }

    clearCanvas() {

        //TODO: clear the canvas by drawing a black filled rectangle
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    paintCanvas() {
        /* Quiz 13 */
        if (this.running) {
            requestAnimationFrame(this.paintCanvas.bind(this));
        }
        this.clearCanvas();
    }

    startGame() {
        /* Quiz 14 */
        super.startGame();
        requestAnimationFrame(this.paintCanvas.bind(this))
    }

}


//--------------------------------------------------------------------------------------
// SnakeGame
//--------------------------------------------------------------------------------------

class SnakeGame extends CanvasGame {
    
    constructor(player, canvas, initial_length = 5) {
        super(player, canvas);
        
        /* Quiz 15 */
        this.snake = new Snake(initial_length,
            { x: canvas.width / 2, y: canvas.height / 2 },
            { dx: 1, dy: 0 },
            this.getCanvasBound(canvas));
            
            
            //TODO: create food object
            this.food = new Food(this.getCanvasBound(canvas));
        }
        
    getCanvasBound(canvas = this.canvas) {
        return { left: 0, top: 0, width: canvas.width, height: canvas.height };
    }

    paintCanvas() {
        super.paintCanvas();
        this.snake.paint(this.ctx);
        this.food.paint(this.ctx);
    }

    startGame() {
        super.startGame();
        this.snake_interval = setInterval(this.tick.bind(this), 25);
        //TODO: create the timer to make the food appear/disappear
        //this.food_interval = ...
        this.food_interval = setInterval(this.food_tick.bind(this), 5000);
    }

    stopGame() {
        super.stopGame();
        clearInterval(this.snake_interval);
        clearInterval(this.food_interval);
    }

    tick() {

        if (this.snake.move() == false) {

            this.health--;

        } else {


            //TODO: check if the snake hit the food
            if (this.food.hit(this.snake)) {
                //TODO: if yes: 1. make the snake eat the food
                this.snake.eat(this.food);
                //TODO: 2. increase the game score
                this.score += this.food.length;
                //TODO: 3. add more food
                this.food = new Food(this.getCanvasBound());

            }
        }

    }

    food_tick() {
        //TODO: reposition the food
        this.food = new Food(this.getCanvasBound());
    }

    keydown(event) {

        /* Quiz 15 */
        if (this.running) event.preventDefault();

        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const key = event.keyCode;

        if (key == LEFT_KEY && this.snake.velocity.dx != 1) {
            this.snake.goLeft();
        }
        if (key == RIGHT_KEY && this.snake.velocity.dx != -1) {
            this.snake.goRight();
        }
        if (key == DOWN_KEY && this.snake.velocity.dy != -1) {
            this.snake.goDown();
        }
        if (key == UP_KEY && this.snake.velocity.dy != 1) {
            this.snake.goUp();
        }
    }

}

//--------------------------------------------------------------------------------------
// Food
//--------------------------------------------------------------------------------------

class Food {

    constructor(bound) {

        function getRandom(min, max) {
            return Math.round((Math.random() * (max - min) + min));
        }

        this.size = {
            w: getRandom(2, 5),
            h: getRandom(2, 5)
        }

        this.position = {
            x: getRandom(bound.left, bound.left + bound.width - this.size.w),
            y: getRandom(bound.top, bound.top + bound.height - this.size.h)
        }
        //TODO: create a random color (Hint: use HSL instead of RGB values)
        this.color = {
            h: Math.round(Math.random() * 360),
            s: Math.round(Math.random() * 100),
            l: 50
        }
    }

    get colorString() {
        /* Quiz 16 */
        return `hsl(${this.color.h}deg ${this.color.s}% ${this.color.l}%)`;
    }

    get length() {
        return this.size.w * this.size.h;
    }

    paint(ctx) {
        //TODO: paint the food on the canvas
        ctx.fillStyle = this.colorString;
        ctx.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);

    }
    

    hit(snake) {
        //TODO: return true if the snake head //(the whole body)// overlaps with the the food rectangle shape
        return snake.position.some((pos) => 
            detectCollisionRect(pos.x, pos.y, this.position.x, this.position.y, this.size.w, this.size.h)
        );    
    }

}

//--------------------------------------------------------------------------------------
// Snake
//--------------------------------------------------------------------------------------

class Snake {

    constructor(len, pos, velocity, bound) {
        this.length = len;
        this.position = [pos]
        this.velocity = velocity
        this.bound = bound;
        this.color = "white";
    }

    goLeft() {
        this.velocity = { dx: -1, dy: 0 };
    }

    goRight() {
        this.velocity = { dx: +1, dy: 0 };
    }

    goDown() {
        this.velocity = { dx: 0, dy: 1 };
    }

    goUp() {
        this.velocity = { dx: 0, dy: -1 };
    }

    move() {
        let result = true;

        /* Quiz 17 */
        let old_pos = { ...this.position[0] };
        let new_pos = {
            x: old_pos.x + this.velocity.dx,
            y: old_pos.y + this.velocity.dy,
        }

        /* Quiz 18 */
        if (new_pos.x > this.bound.left + this.bound.width) {
            new_pos.x = this.bound.left;
            new_pos.y = this.bound.height * Math.random();//random pos: bounus 8

            result = false;
        }
        if (new_pos.x < this.bound.left) {
            new_pos.x = this.bound.left + this.bound.width;
            new_pos.y = this.bound.height * Math.random();//random pos: bounus 8

            result = false;
        }
        if (new_pos.y > this.bound.top + this.bound.height) {
            new_pos.y = this.bound.top;
            new_pos.x = this.bound.width * Math.random();//random pos: bounus 8
            

            result = false;
        }
        if (new_pos.y < this.bound.top) {
            new_pos.y = this.bound.top + this.bound.height;
            new_pos.x = this.bound.width * Math.random();//random pos: bounus 8

            result = false;
        }

        /* Quiz 19 */
        if (this.position.some(p => p.x == new_pos.x && p.y == new_pos.y)) {
            result = false;
        }

        /* Quiz 20 */
        this.position.unshift(new_pos);
        if (this.position.length > this.length) {
            this.position.pop();
        }
        return result;
    }

    eat(food) {
        //TODO: make the snake grow and change color
        this.color = food.colorString; 
        this.length += food.length;
    }

    paint(ctx) {
        this.position.forEach((p) => {

            ctx.fillStyle = this.color;
            ctx.fillRect(p.x, p.y, 1, 1);

        });
    }

}
//TODO; 

/**
 * Call this function to initialize the game
 * @param {DOM} canvas element in which to display the game
 * @param {DOM} start_button to click to start the game
 */
function snake_game_init(canvas, start_button) {

    //TODO: read the player name from the browser address bar
    let url = new URLSearchParams(window.location.search);
    let player = url.get("player") ?? "Player";

    /* Quiz 21 */
    let snake_game = new SnakeGame(player, canvas);

    start_button.addEventListener("click", () => {
        console.log('prova')
        snake_game.startGame();

    });

    //TODO: set up a "keydown" event listener and make it call the corresponding method of the game
    document.addEventListener("keydown", (event) => {
        snake_game.keydown(event);
    });



    //TODO: catch the game over event to update the high score list
    document.addEventListener('game.over', (event) => {
        loadHighscore(event.detail);
        localStorage.setItem("high_scores", JSON.stringify(high_scores));
    });


}

function loadHighscore (newscore) {
    let i = 0;
    while (i < 10) {
        if (high_scores[i] == undefined) {
            high_scores[i] = newscore;
            break;
        } else if (high_scores[i].score < newscore.score) {
            high_scores.splice(i, 0, newscore);
            if (high_scores.length > 10) {
                high_scores.pop();
            }
            break;
        }
        i++;
    }
}

snake_game_init(document.querySelector("canvas"), document.querySelector('button[data-action="start"]'));

high_scores = JSON.parse(localStorage.getItem("high_scores"));


if (high_scores ==  null) {
    high_scores = [];
}

localStorage.setItem("high_scores", JSON.stringify(high_scores));



let name, score;
function set_leaderboard() {
    // if there is no high score break
    if (high_scores.length == 0) {
        return;
    }

    scoreboard = JSON.parse(localStorage.getItem("high_scores"));

    for (let i = 0; i < 3; i++) {
        document.querySelector("#score" +i).innerHTML = scoreboard[i].score;
        document.querySelector("#player" +i).innerHTML = scoreboard[i].player;
    }

}
window.addEventListener('storage', set_leaderboard);
