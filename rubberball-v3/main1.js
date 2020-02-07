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

const getAngle = (rawA, rawB) => {
    let A = { x: rawA[0], y: rawA[1] },
        B = { x: rawB[0], y: rawB[1] };

    if (A.x < B.x) {
        var angle = Math.atan((A.y - B.y) / (A.x - B.x));
    }
    if (A.x > B.x) {
        var angle = Math.atan((A.y - B.y) / (A.x - B.x)) + Math.PI;
    }
    if (angle || angle === -0) {
        while (angle > Math.PI * 2) {
            angle -= Math.PI * 2;
        }
        while (angle < - Math.PI * 2) {
            angle += Math.PI * 2;
        }
        return angle;
    } else {
        return Math.PI / 2;
    }
}

const getColliderAtCoordinates = (x, y, r) => {
    let collidesWith;
    obsticles.forEach(o => {
        o.forEachEdge(edge => {
            let P = { x: x, y: y },
                A = { x: edge[0][0], y: edge[0][1] },
                B = { x: edge[1][0], y: edge[1][1] }

            let AB = Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
            let AP = Math.sqrt((A.x - P.x) ** 2 + (A.y - P.y) ** 2);
            let BP = Math.sqrt((B.x - P.x) ** 2 + (B.y - P.y) ** 2);

            let alpha = Math.acos((-(BP ** 2) + AB ** 2 + AP ** 2) / (2 * AB * AP));
            let beta = Math.acos((-(AP ** 2) + AB ** 2 + BP ** 2) / (2 * AB * BP));

            let distance = Math.sin(alpha) * AP;

            if (distance <= r && alpha < Math.PI / 2 && beta < Math.PI / 2) {
                collidesWith = edge;
            }
        });
        o.forEachPoint(point => {
            let P = { x: x, y: y },
                A = { x: point[0], y: point[1] };

            let AP = Math.sqrt((A.x - P.x) ** 2 + (A.y - P.y) ** 2);

            if (AP <= r) {
                collidesWith = point;
            }
        });
    });
    return collidesWith;
}

var obsticles = [];
class Obsticle {
    constructor(v) {
        this.vertices = v;
        this.style = {
            width: 1
        }
        obsticles.push(this);
        canvas.objectsToRender.push(this);
    }
    render() {
        ctx.beginPath();
        ctx.lineWidth = this.style.width;
        ctx.moveTo(this.vertices[this.vertices.length - 1][0], this.vertices[this.vertices.length - 1][1]);
        this.vertices.forEach(vertex => {
            ctx.lineTo(vertex[0], vertex[1]);
        });
        ctx.stroke();
    }
    forEachPoint(c) {
        this.vertices.forEach(p => {
            c(p);
        });
    }
    forEachEdge(c) {
        for (let i = 0; i < this.vertices.length; i++) {
            if (i === this.vertices.length - 1) {
                c([this.vertices[i], this.vertices[0]]);
            } else {
                c([this.vertices[i], this.vertices[i + 1]]);
            }
        }
    }
}

var balls = [];
class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.timeOfLastMovement;
        this.speed = 4;
        // this.angleOfMotion = (30 / 180 * Math.PI);
        this.angleOfMotion = Math.random() * Math.PI * 4;

        canvas.objectsToRender.push(this);
        balls.push(this);
    }
    render() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.stroke();
    }
    move() {
        let now = Date.now();
        if (this.timeOfLastMovement) {
            let timeDifference = now - this.timeOfLastMovement;
            this.timeOfLastMovement = now;

            if (timeDifference === 0) {
                timeDifference = 1;
            }

            // normalize angle of motion
            while (this.angleOfMotion > Math.PI * 2) {
                this.angleOfMotion -= Math.PI * 2;
            }
            while (this.angleOfMotion < 0) {
                this.angleOfMotion += Math.PI * 2;
            }

            let newX = this.x + Math.cos(this.angleOfMotion) / timeDifference * this.speed;
            let newY = this.y + Math.sin(this.angleOfMotion) / timeDifference * this.speed;

            let collidesWith = getColliderAtCoordinates(newX, newY, this.r);
            if (collidesWith) {
                if (collidesWith[0][0]) {
                    // edge
                    this.bounceOffAnEdge(collidesWith);
                } else {
                    // point 
                    this.bounceOffAPoint(collidesWith);
                }
            } else {
                this.x = newX;
                this.y = newY;
            }

        } else {
            this.timeOfLastMovement = now;
        }
    }
    bounceOffAnEdge(edge) {
        // change angle of motion
        let incomingAngle = this.angleOfMotion;
        let alpha = getAngle(edge[0], edge[1]);
        let diference = (incomingAngle - alpha) * 2

        this.angleOfMotion -= diference;
    }
    bounceOffAPoint(point) {
        // change angle
        this.angleOfMotion = this.angleOfMotion + Math.PI;
    }
}




window.onload = () => {

    // set canvas size 
    canvas.ctx.canvas.width = window.innerWidth - 1;
    canvas.ctx.canvas.height = window.innerHeight - 2;


    var o0 = new Obsticle([[5, 5], [window.innerWidth - 6, 5], [window.innerWidth - 6, window.innerHeight - 7], [5, window.innerHeight - 7]]);

    var o1 = new Obsticle([[200, 200], [400, 280], [310, 400]]);
    var o2 = new Obsticle([[330, 400], [550, 270], [610, 360]]);
    var o3 = new Obsticle([[880, 300], [854, 42], [756, 362]]);
    var o4 = new Obsticle([[520, 600], [780, 750], [810, 540]]);

    // o1.forEachEdge(e => console.log(`A: ${e[0]}, B: ${e[1]}, angle: ${getAngle(e[0], e[1]) / Math.PI * 180}`));

    var ball = new Ball(600, 220, 15);

    const gameIsRunning = true;
    var GAME = setInterval(() => {

        balls.forEach(b => b.move());
        canvas.render();

        if (!gameIsRunning) {
            clearInterval(GAME)
        }

    }, 0);


    window.addEventListener('wheel', function (event) {
        if (event.deltaY < 0) {

            balls.forEach(b => b.speed += 1);

        }
        else if (event.deltaY > 0) {

            balls.forEach(b => b.speed -= 1);

        }
    });
    window.onmousemove = function (e) {
        // console.log(e.clientX, -e.clientY)
    }
}
