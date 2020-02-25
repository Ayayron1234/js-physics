import Collider from './components/collider.js';
import Platformer from './components/platformer.js';
import { GAME } from './components/gameobject.js';
import { Line, Vector } from './components/util.js';

window.onload = () => {

    let border = new Collider([[5, 5], [window.innerWidth - 6, 5], [window.innerWidth - 6, window.innerHeight - 7], [5, window.innerHeight - 7]]);
    // let p1 = new Collider([[200, 400], [500, 400], [500, 480], [700, 480], [700, 400], [1200, 400], [1200, 360], [200, 360]])
    let p2 = new Collider([[200, 400], [400, 400], [600, 440], [700, 440], [900, 400], [1200, 400], [1200, 360], [200, 360]]);
    let player = new Platformer([500, 600], 20);

    GAME.start();

    let e = new Line(new Vector([3, 6]), [1, 1 / 6]);
    let f = new Line(new Vector([1, (-3)]), [1, 1]);
    // let e = new Line(new Vector([3, 6]), [1, 1]);
    // let f = new Line(new Vector([1, 2]), [0, 0]);
    console.log(Line.intersection(e, f));
    console.log(f.steepness);

    let keys = {
        left: false,
        right: false,
        up: false,
        down: false
    }
    window.addEventListener('keydown', e => {
        let k = e.key;
        if (k === 'ArrowLeft') { keys.left = true }
        if (k === 'ArrowRight') { keys.right = true }
        if (k === 'ArrowUp') { keys.up = true }
        if (k === 'ArrowDown') { keys.down = true }
    });
    window.addEventListener('keyup', e => {
        let k = e.key;
        if (k === 'ArrowLeft') { keys.left = false }
        if (k === 'ArrowRight') { keys.right = false }
        if (k === 'ArrowUp') { keys.up = false }
        if (k === 'ArrowDown') { keys.down = false }
    });

    setInterval(() => {
        player.move(keys);
    }, 0);

}