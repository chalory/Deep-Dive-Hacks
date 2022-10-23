const userResponseForm = document.querySelector(".user-response-form");
const userResponse = userResponseForm.querySelector(".user-response");

const predictionResultContainer = document.querySelector(".prediction-result");
const userResponseResult = predictionResultContainer.querySelector(".user-response-result");

userResponseForm.addEventListener("submit", e => {
    e.preventDefault();
    console.log("submit");

    const userResponseValue = userResponse.value?.trim() || "";

    fetch("/index", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            userResponse: userResponseValue,
        }),
    })
        .then(response => {
            if (response.ok) {
                response.json().then(response => {
                    const { final } = response;
                    if (!final) return;

                    const numberPattern = /\d+/g;
                    const results = final.match(numberPattern);
                    console.log(results);

                    predictionResultContainer.classList.add("show");

                    // positive review
                    if (results[0] === "1") {
                        userResponseResult.innerHTML = "Glad you love them too!";
                    } else if (results[1] === "1") {
                        userResponseResult.innerHTML = "Sad to know you don't like them.";
                    } else {
                        userResponseResult.innerHTML = "Neutral response.";
                    }

                    u;
                });
            } else {
                userResponseResult.innerHTML = "Sorry, something went wrong.";
                throw Error("Something went wrong");
            }

            // clear textarea
            userResponse.value = "";
        })
        .catch(error => {
            console.log(error);
        });
});

const canvas = document.querySelector(".canvas-1");

const infoBoxContainer = document.querySelector(".info-box-container");
const infoBox = infoBoxContainer.querySelector(".info-box");

const closeInfoBoxBtn = infoBoxContainer.querySelector(".close-btn");

const speciesImg = document.querySelector(".species-img");
const speciesStory = document.querySelector(".species-story");
const speciesStats = document.querySelector(".species-stats");

const numOfLikesEl = document.querySelector(".num-of-likes");
const maxLikesEl = document.querySelector(".max-likes");
const currentAnimalEl = document.querySelector(".current-animal");

const factsBtn = infoBoxContainer.querySelector(".facts-btn");
factsBtn.addEventListener("click", e => {
    speciesStats.classList.toggle("hide");
    speciesStory.classList.toggle("show");
});

const ctx = canvas.getContext("2d");

// const backgroundImg = new Image();
// backgroundImg.src = "../static/assets/images/ocean-bg.jpg";

// backgroundImg.addEventListener("load", e => {
//     ctx.drawImage(backgroundImg, 0, 0);
// });

const bgMusicBtn = document.querySelector(".bg-music-btn");
const bgMusicBtnIcon = document.querySelector(".bg-music-btn img");
const bgMusic = document.createElement("audio");
bgMusic.src = "../static/assets/sfx/bg-music.wav";
bgMusic.loop = true;
bgMusic.volume = 0.35;

let sfxIsActive = false;

bgMusicBtn.addEventListener("click", e => {
    if (!sfxIsActive) {
        sfxIsActive = true;
        bgMusicBtnIcon.src = "../static/assets/icons/active-sfx-icon.png";
        bgMusic.play();
    } else {
        sfxIsActive = false;
        bgMusicBtnIcon.src = "../static/assets/icons/inactive-sfx-icon.png";
        bgMusic.pause();
    }
});

// canvas.width = 1350;
// canvas.height = 500;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = "25px Georgia";

let score = 0;
let gameFrame = 0;
let gameSpeed = 1;

let needToAnswer = false;

let canvasPosition = canvas.getBoundingClientRect();

const getRandomArbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const renderLikes = () => {
    let maxLikes = getRandomArbitrary(50, 200);
    let currentLikes = getRandomArbitrary(50, maxLikes);

    numOfLikesEl.innerHTML = currentLikes;
    maxLikesEl.innerHTML = maxLikes;

    let percent = (currentLikes / maxLikes) * 100;

    //Update color
    document.documentElement.style.setProperty("--bar-fill", "#57e705");
    document.documentElement.style.setProperty("--bar-top", "#6aff03");

    if (percent <= 50) {
        //yellows
        document.documentElement.style.setProperty("--bar-fill", "#d6ed20");
        document.documentElement.style.setProperty("--bar-top", "#d8ff48");
    }
    if (percent <= 25) {
        //reds
        document.documentElement.style.setProperty("--bar-fill", "#ec290a");
        document.documentElement.style.setProperty("--bar-top", "#ff3818");
    }

    fills.forEach(fill => {
        fill.style.width = percent + "%";
    });
};

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false,
};

canvas.addEventListener("mousedown", event => {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener("mouseup", event => {
    mouse.click = false;
});

// Player -----------
const playerLeft = new Image();
playerLeft.src = "../static/assets/sprites/diver-left.png";

const playerRight = new Image();
playerRight.src = "../static/assets/sprites/diver-right.png";

const swimSfx = document.createElement("audio");
swimSfx.src = "../static/assets/sfx/pop-sound-1.wav";

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 836;
        this.spriteHeight = 470;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        if (mouse.x != this.x) {
            this.x -= dx / 30;
        }

        if (mouse.y != this.y) {
            this.y -= dy / 30;
        }

        // sprite animation
        if (gameFrame % 15 == 0) {
            this.frame++;

            if (this.frame >= 12) this.frame = 0;

            if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }

            if (this.frame < 3) this.frameY = 0;
            else if (this.frameY < 7) this.frameY = 1;
            else if (this.frameY < 11) this.frameY = 2;
            else this.frameY = 0;
        }
    }

    draw() {
        if (mouse.click) {
            swimSfx.play();
            swimSfx.volume = 0.5;
            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            // ctx.lineTo(mouse.x + 300, mouse.y);

            ctx.stroke();
            ctx.strokeStyle = "rgba(255, 255, 255,.5)";
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.x >= mouse.x) {
            ctx.drawImage(
                playerLeft,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0 - 90,
                0 - 55,
                this.spriteWidth / 4,
                this.spriteHeight / 4
            );
        } else {
            ctx.drawImage(
                playerRight,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0 - 60,
                0 - 45,
                this.spriteWidth / 4,
                this.spriteHeight / 4
            );
        }

        ctx.restore();
    }
}

const player = new Player();

// Bubbles ---------------
const bubbles = [];

const bubbleImage = new Image();
bubbleImage.src = "../static/assets/sprites/bubble_pop_frame_01.png";

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        // this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
        this.sound = "sound2";
    }

    update() {
        this.y -= this.speed;

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        // ctx.fillStyle = "green";
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();

        ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 2.6, this.radius * 2.6);
    }
}

// const bubblePopSound1 = document.createElement("audio");
// bubblePopSound1.src = "../static/assets/sfx/pop-sound-1.wav";

const bubblePopSound2 = document.createElement("audio");
bubblePopSound2.src = "../static/assets/sfx/pop-sound-2.ogg";

const handleBubbles = () => {
    if (gameFrame % 70 == 0) {
        bubbles.push(new Bubble());
    }

    bubbles.forEach((bubble, index, arr) => {
        bubble.update();
        bubble.draw();

        if (bubble.y < -bubble.radius) {
            bubbles.splice(index, 1);
            index--;
        } else if (bubble.distance < bubble.radius + player.radius) {
            if (!bubble.counted) {
                if (bubble.sound === "sound1") {
                    bubblePopSound1.play();
                } else {
                    bubblePopSound2.play();
                }

                score++;
                bubble.counted = true;

                arr.splice(index, 1);
                index--;
            }
        }
    });
};

// Repeating Backgrounds ---------------
const waveImg = new Image();
waveImg.src = "../static/assets/images/wave-bg.png";

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
};

const handleBackground = () => {
    BG.x1 -= gameSpeed;
    if (BG.x1 < -BG.width) {
        BG.x1 = BG.width;
    }

    BG.x2 -= gameSpeed;
    if (BG.x2 < -BG.width) {
        BG.x2 = BG.width;
    }

    ctx.drawImage(waveImg, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(waveImg, BG.x2, BG.y, BG.width, BG.height);
};

// Enemies ---------------

class Animal {
    constructor(animalName, enemyImage, spriteWidth, spriteHeight, animalStory) {
        this.spriteImage = enemyImage;
        this.x = canvas.width + 500;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 35;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.noCollision = true;
        this.img = enemyImage;
        this.animalName = animalName;

        this.story = animalStory;
    }

    draw() {
        // ctx.fillStyle = "red";
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();

        ctx.drawImage(
            this.spriteImage,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x - 35,
            this.y - 32,
            this.spriteWidth / 5,
            this.spriteHeight / 5
        );
    }

    update() {
        this.x -= this.speed;

        // reset when it goes off edge
        if (this.x < 0 - this.radius * 2) {
            // reset ability to collide with player
            this.noCollision = true;

            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }

        // sprite animation
        // if (gameFrame % 5 == 0) {
        //     this.frame++;

        //     if (this.frame >= 12) this.frame = 0;

        //     if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        //         this.frameX = 0;
        //     } else {
        //         this.frameX++;
        //     }

        //     if (this.frame < 3) this.frameY = 0;
        //     else if (this.frameY < 7) this.frameY = 1;
        //     else if (this.frameY < 11) this.frameY = 2;
        //     else this.frameY = 0;
        // }

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // collision with player
        if (this.noCollision) {
            if (distance < this.radius + player.radius) {
                this.noCollision = false;
                needToAnswer = true;

                speciesImg.src = this.img.src;
                speciesStory.innerHTML = this.story;
                currentAnimalEl.innerHTML = this.animalName;

                // maxLikes = getRandomArbitrary(50, 200);
                // currentLikes = getRandomArbitrary(50, maxLikes);

                renderLikes();
            }
        }
    }
}

// const enemyImage1 = new Image();
// const enemy1 = new Animal(enemyImage1, 418, 397);

// enemyImage1.src = "../static/assets/sprites/enemy1.png";

// const enemyImage2 = new Image();
// enemyImage2.src = "../static/assets/sprites/enemy2.png";
// const enemy2 = new Animal(enemyImage2, 498, 327);

const turtleImg = new Image();
turtleImg.src = "../static/assets/animals/turtle.png";

const turtle = new Animal(
    "Turtles",
    turtleImg,
    498,
    327,
    "Over the last 200 years, human activities have tipped the scales against the survival of these ancient mariners. Slaughtered for their eggs, meat, skin and shells, sea turtles suffer from poaching and over-exploitation."
);

const seaHorseImg = new Image();
seaHorseImg.src = "../static/assets/animals/sea-horse.png";
const seaHorse = new Animal(
    "Seahorses",
    seaHorseImg,
    408,
    400,
    "Worldwide, seahorses are in trouble, threatened by habitat loss, and sold in a massive global trade. Scientists say this can't go on, or seahorses will severely decline."
);

const starfishImg = new Image();
starfishImg.src = "../static/assets/animals/starfish.png";
const starFish = new Animal(
    "Starfishes",
    starfishImg,
    500,
    400,
    "The main worldwide threat to starfish is thought to be sea star wasting (SSW) disease, also called sea star wasting syndrome (SSWS). While this is a problem in its own right, it can also be linked to other threats including rising sea temperatures due to climate change."
);

const crabImg = new Image();
crabImg.src = "../static/assets/animals/crab.png";
const crab = new Animal(
    "Crabs",
    crabImg,
    500,
    400,
    "As a result of overharvesting for use as food, bait and biomedical testing, and because of habitat loss, the American horseshoe crab is listed as Vulnerable to extinction."
);

const handleEnemies = () => {
    // enemy1.update();
    // enemy1.draw();

    // enemy2.update();
    // enemy2.draw();

    turtle.update();
    turtle.draw();

    seaHorse.update();
    seaHorse.draw();

    starFish.update();
    starFish.draw();

    crab.update();
    crab.draw();
};

// Animation Loop ---------------
const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handleBackground();
    handleBubbles();

    player.update();
    player.draw();

    handleEnemies();

    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 30);

    gameFrame++;

    if (!needToAnswer) {
        requestAnimationFrame(animate);
    } else {
        // show info/text box
        infoBoxContainer.classList.add("show");
        infoBox.classList.add("show");
    }
};

closeInfoBoxBtn.addEventListener("click", e => {
    infoBoxContainer.classList.remove("show");
    infoBox.classList.remove("show");
    needToAnswer = false;
    noCollision = true;
    requestAnimationFrame(animate);
});

animate();

window.addEventListener("resize", e => {
    canvasPosition.canvas.getBoundingClientRect();
});

// ! PERCENTAGE BAR =========================================
let fills = document.querySelectorAll(".likes_fill");
