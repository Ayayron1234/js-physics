const canvas = {
    element: document.querySelector('canvas'),
    objectsToRender: [],
    ctx: document.querySelector('canvas').getContext('2d'),
    render: () => {
        ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
        canvas.objectsToRender.forEach(i => {
            i.render();
        });
    }
}
const ctx = canvas.ctx;

const log = (text) => {
    document.querySelector('.console').innerHTML += text;
}
const clearLog = () => {
    document.querySelector('.console').innerHTML = '';
}


const getAngle = (A, B) => {
    let a = B[1] - A[1];
    let b = B[0] - A[0];
    let angle = Math.tan(a / b);
    if (angle || angle === -0) {
        return angle;
    } else {
        return Math.PI / 2;
    }
}


class Collider {
    constructor(points) {
        this.points = points;
        this.color = '#000000';
        this.width = 2;
    }
    render() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.points[this.points.length - 1][0], this.points[this.points.length - 1][1]);
        this.points.forEach(point => {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.stroke();
    }
    forEachPoint(callback) {
        this.points.forEach(p => {
            callback(p);
        });
    }
    forEachEdge(callback) {
        for (let i = 0; i < this.points.length; i++) {
            if (i === this.points.length - 1) {
                callback(this.points[i], this.points[0]);
            } else {
                callback(this.points[i], this.points[i + 1]);
            }
        }
    }
}

class Platformer {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.r = 30;
        this.colliders = [];
        this.angleOfMotion = (Math.PI / 4);
        this.color = '#000000';
        this.width = 2;
    }
    render() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.stroke();
    }
    bounceFromEdge(edge) {
        let incomingAngle = this.angleOfMotion;
        let alpha = getAngle(edge[0], edge[1]); // angle of the edge and a horizontal line
        let diference = (incomingAngle - alpha) * 2

        this.angleOfMotion -= diference;
    }
    checkForCollisions() {
        let collidesWith = [];
        this.colliders.forEach(c => {
            let e = this.checkForCollision(c);
            if (e) {
                collidesWith.push(e);
            }
        });
        return collidesWith;
    }
    checkForCollision(collider) {
        let collides = false;
        let EDGE = [];
        let POINT = [];
        collider.forEachEdge((rawA, rawB) => {
            // Points and their coordinates:
            let P = { x: this.x, y: this.y },
                A = { x: rawA[0], y: rawA[1] },
                B = { x: rawB[0], y: rawB[1] }

            // Edges and their lengths:
            let AB = Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
            let AP = Math.sqrt((A.x - P.x) ** 2 + (A.y - P.y) ** 2);
            let BP = Math.sqrt((B.x - P.x) ** 2 + (B.y - P.y) ** 2);

            // Angles:
            let alpha = Math.acos((-(BP ** 2) + AB ** 2 + AP ** 2) / (2 * AB * AP));
            let beta = Math.acos((-(AP ** 2) + AB ** 2 + BP ** 2) / (2 * AB * BP));

            let distance = Math.sin(alpha) * AP;

            if (distance <= this.r && alpha < Math.PI / 2 && beta < Math.PI / 2) {
                EDGE = [rawA, rawB];
                collides = true;
            }
        });
        collider.forEachPoint(point => {
            let P = { x: this.x, y: this.y },
                A = { x: point[0], y: point[1] };

            let AP = Math.sqrt((A.x - P.x) ** 2 + (A.y - P.y) ** 2);

            if (AP <= this.r) {
                POINT = [point[0], point[1]];
                collides = true;
            }
        });
        if (!collides) {
            return false;
        } else {
            if (EDGE) {
                return EDGE;
            } else if (POINT) {
                POINT;
            }
        }
    }
}


window.onload = () => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    let polygon1 = new Collider([[200, 200], [800, 100], [500, 280], [480, 300], [750, 360], [400, 500]]);
    let polygon2 = new Collider([[900, 500], [950, 800], [600, 700]]);
    let polygon3 = new Collider([[0, 0], [0, 1000], [1000, 1000], [1000, 0]]);

    let ball = new Platformer();
    ball.x = 300;
    ball.y = 100;
    ball.colliders.push(polygon1, polygon2, polygon3)

    canvas.objectsToRender.push(polygon1, polygon2);
    canvas.objectsToRender.push(ball);

    canvas.render();

    let lastTime = 0;
    var game = setInterval(() => {
        let now = Date.now();
        if (lastTime === 0) {
            lastTime = now;
        } else {
            var diference = now - lastTime;
            lastTime = now;
            ball.y += Math.sin(ball.angleOfMotion) / diference * 3;
            ball.x += Math.cos(ball.angleOfMotion) / diference * 3;

            let collidingEdge = ball.checkForCollisions();
            if (collidingEdge.length > 0) {
                ball.bounceFromEdge(collidingEdge[0]);
            }

            canvas.render();
        }
    }, 0);

}