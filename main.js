
/**
 * SHADOW CATCHER - FINAL PROJECT (SPRING 2026)
 * 
 * [Graphics Concepts]:
 * - Transformation: translate(), rotate(), scale() used for animations.
 * - Collision: Circle-to-circle logic in intersects().
 * - Masking: erase() for the darkness/flashlight effect.
 * - Color Theory: Level 4 Magenta Filter (Subtractive Color Filtering).
 * - Safe Start: Invulnerability shield at level start.
 */



let gameState = "START_SCREEN"; 
let currentLevel = 1;
let score = 0;
let highScore = 0;
let lives = 3;
let levelTimer = 0;

let player;
let orbs = [];
let enemies = [];
let powerups = []; 
let portal = null;

let flashlightRadius = 200;
let maxFlashlightLevel = 200;
let isIlluminated = false;
let illuminationTimer = 0;
let lightMask;

let colorFlashlight, colorOrb, colorEnemy;

function setup() {
    createCanvas(800, 600);
    highScore = localStorage.getItem("shadowCatcherHighScore") || 0;
    lightMask = createGraphics(width, height);
    initLevel(1);
}

function draw() {
    background(10);

    if (gameState === "START_SCREEN") {
        drawStartScreen();
    } else if (gameState === "PLAYING") {
        playGame();
    } else if (gameState === "LEVEL_WIN") {
        drawLevelWinScreen();
    } else if (gameState === "GAME_OVER") {
        drawGameOverScreen();
    }
}

function initLevel(level) {
    currentLevel = level;
    levelTimer = millis();
    
    if (level === 4) {
        colorFlashlight = color(255, 0, 255, 95); 
        colorOrb = color(255, 255, 255);         
        colorEnemy = color(255, 255, 0);         
    } else {
        colorFlashlight = color(255, 255, 255, 0); 
        colorOrb = color(0, 255, 255); 
        colorEnemy = color(255, 0, 80); 
    }

    maxFlashlightLevel = max(80, 220 - (level * 10));
    flashlightRadius = maxFlashlightLevel;
    let enemyCount = 1 + floor(level * 1.1);
    let orbCount = 3 + floor(level/2);
    let enemySpeed = 1.6 + (level * 0.3);

    player = new Player(width / 2, height / 2);
    player.invulnUntil = millis() + 2000; 

    portal = null;
    orbs = []; enemies = []; powerups = [];
    isIlluminated = false;

    for (let i = 0; i < orbCount; i++) orbs.push(new GameObject("ORB"));
    for (let i = 0; i < enemyCount; i++) enemies.push(new Enemy(enemySpeed));
    
    powerups.push(new GameObject("BATTERY"));
    if (level >= 2) powerups.push(new GameObject("BULB"));
    if (level >= 3) powerups.push(new GameObject("SPEED"));
}

function playGame() {
    player.update();

    if (!isIlluminated) {
        flashlightRadius -= (0.07 + (currentLevel * 0.01));
        flashlightRadius = max(35, flashlightRadius);
        
        // Batarya ölümü kontrolü
        if (flashlightRadius <= 35) {
            checkHighScore();
            gameState = "GAME_OVER";
        }
    } else {
        if (millis() - illuminationTimer > 3000) isIlluminated = false;
    }

    for (let i = orbs.length - 1; i >= 0; i--) {
        orbs[i].display();
        if (player.intersects(orbs[i])) { orbs.splice(i, 1); score += 100; }
    }

    for (let i = powerups.length - 1; i >= 0; i--) {
        powerups[i].display();
        if (player.intersects(powerups[i])) { applyPowerUp(powerups[i].type); powerups.splice(i, 1); }
    }

    if (orbs.length === 0 && portal === null) portal = new Portal(width / 2, height / 2);
    if (portal) {
        portal.display();
        if (player.intersects(portal)) { score += 500; gameState = "LEVEL_WIN"; }
    }

    for (let enemy of enemies) {
        enemy.update();
        enemy.display();
        if (millis() > player.invulnUntil) {
            if (player.intersects(enemy)) {
                lives--;
                player.reset();
                player.invulnUntil = millis() + 1500; 
                if (lives <= 0) { checkHighScore(); gameState = "GAME_OVER"; }
            }
        }
    }

    player.display();
    if (!isIlluminated) drawFlashlightEffect();
    drawUI();
}

function applyPowerUp(type) {
    if (type === "BATTERY") flashlightRadius = maxFlashlightLevel;
    else if (type === "BULB") { isIlluminated = true; illuminationTimer = millis(); }
    else if (type === "SPEED") player.speedBoost = 180;
}

function drawFlashlightEffect() {
    lightMask.clear();
    lightMask.background(0, 0, 0, 252);
    lightMask.push();
    lightMask.erase();
    lightMask.ellipse(mouseX, mouseY, flashlightRadius * 2, flashlightRadius * 2);
    lightMask.noErase();
    if (currentLevel === 4) {
        lightMask.fill(colorFlashlight);
        lightMask.noStroke();
        lightMask.ellipse(mouseX, mouseY, flashlightRadius * 2, flashlightRadius * 2);
    }
    lightMask.pop();
    image(lightMask, 0, 0);
}

class Player {
    constructor(x, y) { this.pos = createVector(x, y); this.r = 15; this.speedBoost = 0; this.invulnUntil = 0; }
    reset() { this.pos.set(width / 2, height / 2); }
    update() {
        let s = 4 + (this.speedBoost > 0 ? 3 : 0);
        if (this.speedBoost > 0) this.speedBoost--;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.pos.x -= s;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.pos.x += s;
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.pos.y -= s;
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.pos.y += s;
        this.pos.x = constrain(this.pos.x, this.r, width - this.r);
        this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }
    display() {
        push(); translate(this.pos.x, this.pos.y);
        if (millis() < this.invulnUntil) { noFill(); stroke(0, 255, 100); strokeWeight(2); ellipse(0, 0, this.r * 2.8 + sin(frameCount*0.2)*5); }
        fill(255); noStroke(); ellipse(0, 0, this.r * 2); pop();
    }
    intersects(other) { return dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < (this.r + other.r); }
}

class GameObject {
    constructor(type) { this.type = type; this.pos = createVector(random(60, width-60), random(60, height-60)); this.r = (type === "ORB") ? 11 : 14; }
    display() {
        let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
        if (d < flashlightRadius || isIlluminated) {
            push(); translate(this.pos.x, this.pos.y); scale(1 + sin(frameCount * 0.1) * 0.1); noStroke();
            if (this.type === "ORB") fill(colorOrb); else if (this.type === "BATTERY") fill(0, 255, 0); else if (this.type === "BULB") fill(255, 255, 0); else if (this.type === "SPEED") fill(0, 150, 255);
            if (this.type === "BATTERY") rect(-10, -12, 20, 24); else ellipse(0, 0, this.r * 2); pop();
        }
    }
}

class Enemy {
    constructor(speed) { this.pos = createVector(random(width), random(height)); this.vel = p5.Vector.random2D().mult(speed); this.r = 18; }
    update() { this.pos.add(this.vel); if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1; if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1; }
    display() {
        let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
        if (d < flashlightRadius || isIlluminated) { push(); translate(this.pos.x, this.pos.y); rotate(frameCount * 0.06); stroke(colorEnemy); strokeWeight(4); noFill(); rectMode(CENTER); rect(0, 0, 26, 26); pop(); }
    }
}

class Portal {
    constructor(x, y) { this.pos = createVector(x, y); this.r = 35; }
    display() { push(); translate(this.pos.x, this.pos.y); rotate(frameCount * 0.03); stroke(200, 0, 255); noFill(); strokeWeight(5); for(let i=0; i<4; i++) { rotate(PI/2); ellipse(15, 0, 65, 20); } pop(); }
}

function drawUI() {
    textAlign(LEFT); textSize(16);
    
    if (lives === 1) fill(255, 0, 0); 
    else fill(0, 255, 100); 
    text(`LIVES: ${"❤".repeat(max(0, lives))}`, 20, 30);

    let batRatio = flashlightRadius / maxFlashlightLevel;
    if (batRatio > 0.6) fill(0, 255, 100);
    else if (batRatio > 0.3) fill(255, 255, 0);
    else fill(255, 0, 0);
    rect(180, 18, max(0, batRatio * 120), 10);
    fill(255); textSize(10); text("FLASHLIGHT ENERGY", 180, 42);

    textAlign(RIGHT); fill(255); textSize(16);
    text(`LEVEL: ${currentLevel} | SCORE: ${score}`, width - 20, 30);

    if (currentLevel === 4) { textAlign(CENTER); fill(255, 0, 255); textSize(14); text("CHROMATIC CHALLENGE: MAGENTA FILTER ACTIVE", width/2, 80); }
    if (millis() < player.invulnUntil) { textAlign(CENTER); fill(0, 255, 100); textSize(14); text("GREEN SHIELD ACTIVE", width/2, height - 30); }
    if (orbs.length === 0 && portal) { textAlign(CENTER); fill(200, 0, 255); textSize(18); text("PORTAL OPENED - FIND THE EXIT!", width/2, 120); }
}

function drawStartScreen() {
    textAlign(CENTER, CENTER);
    fill(0, 255, 255); textSize(55); text("SHADOW CATCHER", width/2, height/2 - 140);
    
    fill(255); textSize(18);
    // Açıklama metinleri (Tırnaksız) ve "Watch your battery" eklendi
    text("The environment is dark. Use your flashlight to see.", width/2, height/2 - 90);
    text("Collect Cyan Orbs to open the Portal.", width/2, height/2 - 60);
    text("Avoid the Red Shadows hidden in the dark.", width/2, height/2 - 30);
    text("Watch your battery.", width/2, height/2);
    
    fill(255, 255, 0); textSize(24);
    text("CLICK TO CHALLENGE THE DARKNESS", width/2, height/2 + 50);
    
    fill(200); textSize(15);
    text("Cyan: Orbs | Green: Battery | Yellow: Bulb | Blue: Speed", width/2, height/2 + 95);
    
    fill(150); textSize(14);
    text("Controls: WASD or ARROWS to move | MOUSE to aim light", width/2, height/2 + 140);
}

function drawLevelWinScreen() {
    textAlign(CENTER, CENTER);
    fill(0, 255, 150); textSize(50); text(`LEVEL ${currentLevel} COMPLETED`, width/2, height/2 - 20);
    fill(255); textSize(25); text("Click to Advance", width/2, height/2 + 50);
}

function drawGameOverScreen() {
    background(10);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0); textSize(80); text("GAME OVER", width/2, height/2 - 100);
    fill(255); textSize(40); text(`Final Score: ${score}`, width/2, height/2);
    fill(0, 255, 255); textSize(40); text(`Best Score: ${highScore}`, width/2, height/2 + 70);
    fill(255, 255, 0); textSize(30); text("CLICK TO RESTART", width/2, height/2 + 170);
}

function checkHighScore() {
    if (score > highScore) { highScore = score; localStorage.setItem("shadowCatcherHighScore", highScore); }
}

function mousePressed() {
    if (gameState === "START_SCREEN") { score = 0; lives = 3; initLevel(1); gameState = "PLAYING"; }
    else if (gameState === "LEVEL_WIN") { initLevel(currentLevel + 1); gameState = "PLAYING"; } }
