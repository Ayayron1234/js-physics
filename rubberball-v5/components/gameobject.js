import canvas from './canvas.js';

var nextId = 0;
var gameObjects = [];
var activeGameObjects = [];

export var GAME = {
    isRunning: true,
    start: () => {
        console.log('-------------------------\ngame started...\n-------------------------');

        GAME.isRunning = true;

        canvas.ctx.canvas.width = window.innerWidth - 1;
        canvas.ctx.canvas.height = window.innerHeight - 2;

        var game = setInterval(() => {
            if (GAME.isRunning) {
                activeGameObjects.forEach(o => {
                    o.tick();
                });
                canvas.render();
            } else {
                clearInterval(game);
            }
        }, 0);
    },
    stop: () => {
        console.log('-------------------------\ngame stopped...\n-------------------------')
        GAME.isRunning = false;
    }
}

export default class GameObject {
    constructor() {
        this.uid = nextId;
        nextId++;

        console.log(this);
        if (this.tick) {
            activeGameObjects.push(this);
        }

        gameObjects.push(this);
    }
}
