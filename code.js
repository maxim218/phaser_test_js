"use strict";

let applicationContext = null;

function myButtonClickAction() {
    const isVisible = applicationContext.labelObj.visible;
    applicationContext.labelObj.setVisible(!isVisible);
    applicationContext.musicB.play();
}

function myPointerDownAction(pointer) {
    const positionText = `X: ${pointer.x}  Y: ${pointer.y}`;
    console.log("Pointer DOWN: " + positionText);
}

function myPointerUpAction(pointer) {
    const positionText = `X: ${pointer.x}  Y: ${pointer.y}`;
    console.log("Pointer UP: " + positionText);
}

const mainScene = new Phaser.Scene("MainScene");

mainScene.preload = function () {
    this.load.audio('musicA', './assets/soundBackground.mp3');
    this.load.audio('musicB', './assets/soundTakeBonus.mp3');
    this.load.image('bg', './assets/backgroundImage.jpg');
    this.load.image('hero', './assets/playerImage.png');
    this.load.image('star', './assets/starImage.png');
};

mainScene.create = function () {
    applicationContext = this;

    this.input.on('pointerdown', myPointerDownAction, this);
    this.input.on('pointerup', myPointerUpAction, this);

    const musicA = this.sound.add('musicA', { loop: true, volume: 0.35 });
    const musicB = this.sound.add('musicB', { loop: false, volume: 0.9 });
    musicA.play();
    
    const myButton = this.add.text(0, 0, "", {});
    myButton.text = "   Click Me   ";
    myButton.depth = 35;
    myButton.x = 30;
    myButton.y = 110;
    myButton.padding = {
        left: 30, right: 30, top: 20, bottom: 20
    };
    myButton.setStyle({
        fontSize: "30px",
        fontFamily: "MyRegularFont, Geneva, Arial, Helvetica, sans-serif",
        color: "#FFFFFF",
        backgroundColor: "rgba(60, 120, 170, 0.5)"
    });
    myButton.setInteractive();
    myButton.on("pointerdown", myButtonClickAction);
    
    const labelObj = this.add.text(0, 0, "", {});
    labelObj.text = "Seconds: 0";
    labelObj.x = 30;
    labelObj.y = 30;
    labelObj.depth = 25;
    labelObj.setStyle({
        color: "#7CFC00",
        fontSize: "40px",
        backgroundColor: "rgba(0, 0, 255, 0.3)",
        fontFamily: "MyRegularFont, Geneva, Arial, Helvetica, sans-serif"
    });
    
    const bgObj = this.add.sprite(0, 0, 'bg');
    bgObj.setOrigin(0, 0);
    bgObj.x = 50;
    bgObj.y = 50;
    bgObj.displayWidth = 500;
    bgObj.displayHeight = 300;
    bgObj.depth = 5;
    
    const heroObj = this.add.sprite(0, 0, 'hero');
    heroObj.x = 150;
    heroObj.y = 150;
    heroObj.displayWidth = 90;
    heroObj.displayHeight = 140;
    heroObj.depth = 7;
    heroObj.flipX = true;
    
    const starObj = this.add.sprite(0, 0, 'star');
    starObj.depth = 9;
    starObj.x = 450;
    starObj.y = 200;
    starObj.displayWidth = 100;
    starObj.displayHeight = 100;
    starObj.angle = 45;
    
    const arrayStars = [];
    for (let i = 0; i < 4; i++) {
        const star = this.add.sprite(0, 0, 'star');
        star.x = i * 80 + 100;
        star.y = 300;
        star.displayWidth = 50;
        star.displayHeight = 50;
        star.depth = 15;
        arrayStars.push(star);
    }
    
    this.labelObj = labelObj;
    this.arrayStars = arrayStars;
    this.heroObj = heroObj;
    this.starObj = starObj;
    this.musicA = musicA;
    this.musicB = musicB;
    
    this.logMessagesInUpdate = false;
    this.secondsCounter = 0;
};

mainScene.update = function (time, delta) {
    const deltaTimeSeconds = delta / 1000;
    
    const message = `Update call: ${time} : ${deltaTimeSeconds}`;
    if (this.logMessagesInUpdate) 
        console.log(message);
    
    const speedHeroMoving = 30;
    this.heroObj.x += (speedHeroMoving * deltaTimeSeconds);
    
    const speedStarRotating = 70;
    this.starObj.angle += (speedStarRotating * deltaTimeSeconds);
    
    const speedStarMoving = -18;
    for (let i = 0; i < this.arrayStars.length; i++) 
        this.arrayStars[i].y += (speedStarMoving * deltaTimeSeconds);

    this.secondsCounter += deltaTimeSeconds;
    this.labelObj.text = "Seconds: " + parseInt(this.secondsCounter);
    
    if (parseInt(this.secondsCounter) === 12) {
        this.secondsCounter = 0;
        this.heroObj.x = 150;
        this.heroObj.y = 150;
        for (let i = 0; i < this.arrayStars.length; i++) 
            this.arrayStars[i].y = 300;
    }
};

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    scene: mainScene,
    fps: {
        limit: 120
    }
};

const game = new Phaser.Game(config);
