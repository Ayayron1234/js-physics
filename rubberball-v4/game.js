import Collider from './components/collider.js';
import canvas from './components/canvas.js';
import PhysicsObject, { physicsObjects } from './components/physicsobject.js';

window.onload = () => {

    canvas.ctx.canvas.width = window.innerWidth - 1;
    canvas.ctx.canvas.height = window.innerHeight - 2;


    let border = new Collider([[5, 5], [window.innerWidth - 6, 5], [window.innerWidth - 6, window.innerHeight - 7], [5, window.innerHeight - 7]]);

    var o1 = new Collider([[200, 200], [400, 280], [310, 400]]);
    var o2 = new Collider([[330, 400], [550, 270], [610, 360]]);
    var o3 = new Collider([[880, 300], [854, 42], [756, 362]]);
    var o4 = new Collider([[520, 600], [780, 750], [810, 540]]);


    let s1 = new Collider([[200, 100], [300, 100], [250, 80]])

    let ball = new PhysicsObject(600, 800, 20);
    // let ball2 = new PhysicsObject(Math.random() * 1400 + 30, 880, 15);
    // let ball3 = new PhysicsObject(Math.random() * 1400 + 30, 880, 15);
    // let ball4 = new PhysicsObject(Math.random() * 1400 + 30, 880, 15);
    // let ball5 = new PhysicsObject(Math.random() * 1400 + 30, 880, 15);

    var gameIsRunning = true;
    let lastTick = 0;
    var game = setInterval(() => {

        // check computing speed
        /* -- COMMENT THIS --
        let now = Date.now();
        console.log(now - lastTick);
        lastTick = now;
        // */

        physicsObjects.forEach(b => b.move());
        canvas.render();

        if (!gameIsRunning) {
            clearInterval(game)
        }

    }, 0);

    window.addEventListener('keydown', e => {
        let key = e.key;

        if (key === 'ArrowUp' && ball.isOnFloor) {
            ball.verticalSpeed += 800;
        }
        if (key === 'ArrowRight') {
            ball.horisontalSpeed = 200;
        }
        if (key === 'ArrowLeft') {
            ball.horisontalSpeed = -200;
        }
    })

    window.addEventListener('wheel', function (event) {
        if (event.deltaY < 0) {

            physicsObjects.forEach(b => b.verticalSpeed += 100);

        }
        else if (event.deltaY > 0) {

            physicsObjects.forEach(b => b.verticalSpeed -= 100);

        }
    });

}
