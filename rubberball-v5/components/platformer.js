import canvas from './canvas.js';
import Collider, { getColliderAtCoordinates, getCollidersAtCoordinates } from './collider.js';
import { Vector, Line, getAngle, getLengthOfSection } from './util.js';
import GameObject from './gameobject.js';
import Polygon from './polygon.js';


export default class Platformer extends GameObject {
    constructor(l, r) {
        super();
        this.x = l[0];
        this.y = l[1];
        this.r = r;

        this.m = 0.1;
        this.g = 9.81;
        this.forces = [];
        this.speed = new Vector([0, 0]);
        this.acceleration = new Vector([0, 0]);

        this.timeOfLastMovement;
        this.maxSpeed = 300;
        this.maxFallSpeed = 1000;
        this.maxAcceleration = 3000;

        this.isByWall = false;
        this.isOnFloor = false;

        canvas.objectsToRender.push(this);
    }

    get G() {
        return new Vector([0, -this.g * this.m * 1000]);
    }
    get location() {
        return [this.x, this.y];
    }
    set location(c) {
        this.x = c[0];
        this.y = c[1];
    }

    render() {
        canvas.ctx.beginPath();
        canvas.ctx.strokeStyle = this.color;
        canvas.ctx.lineWidth = this.width;
        canvas.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        canvas.ctx.stroke();
    }
    move(keys) {
        let speed = 1000;
        if (keys.right) {
            this.applyForce(new Vector([speed, 0]));
        }
        if (keys.left) {
            this.applyForce(new Vector([-speed, 0]));
        }
        // -----------------------------------
        // if (keys.up && this.isOnFloor) {
        //     this.applyForce(new Vector([0, speed * 10]));
        // }
        // ----------------------------------- 
        if (keys.up) {
            this.applyForce(new Vector([0, speed]));
        }
        // -----------------------------------
        if (keys.down) {
            this.applyForce(new Vector([0, -speed]));
        }
    }
    tick() {
        let now = Date.now();
        if (this.timeOfLastMovement) {
            var timeDifference = now - this.timeOfLastMovement;
            this.timeOfLastMovement = now;
        } else {
            var timeDifference = 1;
            this.timeOfLastMovement = now;
        }
        if (timeDifference === 0) {
            timeDifference = 1;
        }
        let t = timeDifference / 1000;

        // apply gravity
        // this.applyForce(this.G);

        // calculate sum of forces
        this.acceleration = this.calculateAcceleration();
        this.forces = [];

        // acceletate speed and calculate new location
        this.accelerate(t);
        var newLocation = [this.x + this.speed.c[0] * t, this.y + this.speed.c[1] * t];

        // check for collision
        let colliders = getCollidersAtCoordinates(this.location, this.r + 1);
        if (colliders && colliders.length > 0) {
            // a collision has been detected
            this.isOnFloor = true;
            if (colliders.length > 0) {
                if (colliders[0].type === 'point') {
                    let A = this.location,
                        B = colliders[0].c;
                    let a = new Vector([A[0] - B[0], A[1] - B[1]]);
                    let l = [[B[0] - a.multiplyByNumber(4).c[1], B[1] + a.multiplyByNumber(4).c[0]], [B[0] + a.multiplyByNumber(4).c[1], B[1] - a.multiplyByNumber(4).c[0]]];

                    let line = new Line(l, 'red');

                    this.speed = this.speed.calculateProjectionToSection(l);

                    var newLocation = [this.x + this.speed.c[0] * t, this.y + this.speed.c[1] * t];
                    this.location = newLocation;
                } else {
                    this.speed = this.speed.calculateProjectionToSection(colliders[0].c);

                    var newLocation = [this.x + this.speed.c[0] * t, this.y + this.speed.c[1] * t];
                    this.location = newLocation;
                }
            } else if (colliders.length === 2) {
            }
        } else {
            // no collision is detected
            this.location = newLocation;
            this.isOnFloor = false;
        }
    }
    checkIfOnFloor() {
        let f = getColliderAtCoordinates(this.x, this.y - 1, this.r);
        if (f) {
            this.isOnFloor = true;
        } else {
            this.isOnFloor = false;
        }
    }
    calculateAcceleration() {
        let x = 0,
            y = 0;
        this.forces.forEach(F => {
            x += F.c[0];
            y += F.c[1];
        });
        let acceleration = new Vector([x, y]);

        // ----------------- Don't delete! --------------- 
        if (acceleration.length > this.maxAcceleration)
            acceleration.length = this.maxAcceleration;
        if (acceleration.length < -this.maxAcceleration)
            acceleration.length = -this.maxAcceleration;
        // ----------------------------------------------- 

        // ----------------- Don't delete! --------------- 
        // if (acceleration.c[0] > this.maxAcceleration)
        //     acceleration.length = this.maxAcceleration;
        // if (acceleration.c[0] < -this.maxAcceleration)
        //     acceleration.length = -this.maxAcceleration;
        // ----------------------------------------------- 

        return acceleration;
    }
    accelerate(t) {
        let newSpeed = Vector.add(this.speed, this.acceleration.multiplyByNumber(t));

        // ----------------- Don't delete! --------------- 
        if (newSpeed.length > this.maxSpeed)
            newSpeed.length = this.maxSpeed;
        if (newSpeed.length < -this.maxSpeed)
            newSpeed.length = -this.maxSpeed;
        // ----------------------------------------------- 

        // ----------------- Don't delete! --------------- 
        // if (newSpeed.c[0] > this.maxSpeed) {
        //     newSpeed.c[0] = this.maxSpeed;
        // } else if (newSpeed.c[0] < -this.maxSpeed) {
        //     newSpeed.c[0] = -this.maxSpeed;
        // }
        // if (newSpeed.c[1] < -this.maxFallSpeed)
        //     newSpeed.c[1] = -this.maxFallSpeed;
        // ----------------------------------------------- 

        if (this.acceleration.length > 0) {
            this.speed = newSpeed;
        } else {
            this.speed = this.speed.multiplyByNumber(19 / 20);
        }

    }
    applyForce(F) {
        this.forces.push(F);
    }
}
