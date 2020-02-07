import canvas from './canvas.js';
import { getColliderAtCoordinates } from './collider.js';


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

const normalizeAngle = (angle) => {
    while (angle > Math.PI * 2) {
        angle -= Math.PI * 2;
    }
    while (angle < 0) {
        angle += Math.PI * 2;
    }
    return angle;
}


export var physicsObjects = [];

export default class PhysicsObject {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.isOnFloor = false;
        this.elasticity = 0.7;
        this.mass = 0.9;
        this.friction = 10;

        this.gVectorH = 0;
        this.gVectorV = 0;

        this.timeOfLastMovement;
        this.horisontalSpeed = Math.random() * 200 - 100;
        this.verticalSpeed = Math.random() * 200 - 100;

        this.angleOfMotion = Math.random() * Math.PI * 4;
        this.speedAtCollision = 500;

        canvas.objectsToRender.push(this);
        physicsObjects.push(this);
    }
    render() {
        canvas.ctx.beginPath();
        canvas.ctx.strokeStyle = this.color;
        canvas.ctx.lineWidth = this.width;
        canvas.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        canvas.ctx.stroke();
    }
    move() {
        let now = Date.now();
        if (this.timeOfLastMovement) {
            // get time difference between calculation
            let timeDifference = now - this.timeOfLastMovement;
            this.timeOfLastMovement = now;
            if (timeDifference === 0) {
                timeDifference = 1;
            }

            if (this.isOnFloor) {
                // // check if still on floor
                // if (getColliderAtCoordinates(this.x, this.y - 1, this.r)) {
                //     // get angle of floor
                //     let f = getColliderAtCoordinates(this.x, this.y - 1, this.r);
                //     let alpha = getAngle(f[0], f[1])
                //     if (f && f[0]) {
                //         if (alpha > 0 && alpha < Math.PI) {
                //             alpha = alpha + Math.PI;
                //         }
                //         if (alpha > Math.PI / 2 && alpha < Math.PI) {
                //             alpha = alpha + Math.PI;
                //         }
                //     }
                //     this.angleOfMotion = alpha;

                //     if (alpha > 0.001 || alpha < -0.001) {
                //         this.angleOfMotion = alpha;

                //         // apply gravity
                //         let g = 9.8;

                //         this.gVectorH += this.mass * g / this.friction;
                //         this.gVectorV += this.mass * g / this.friction;


                //         this.horisontalSpeed = Math.cos(this.angleOfMotion) * this.gVectorH;
                //         this.verticalSpeed = Math.sin(this.angleOfMotion) * this.gVectorV;

                //         // // apply friction
                //         // this.horisontalSpeed -= Math.cos(this.angleOfMotion) * this.friction;
                //         // this.verticalSpeed -= Math.sin(this.angleOfMotion) * this.friction;

                //         // calculate new position
                //         this.x += this.horisontalSpeed * (timeDifference / 1000);
                //         this.y += this.verticalSpeed * (timeDifference / 1000);
                //     }
                // } else {
                //     this.isOnFloor = false;
                // }
            } else {
                // normalize angle of motion
                this.angleOfMotion = normalizeAngle(this.angleOfMotion);

                // add gravity
                let g = 9.8;
                let fallingVelocity = g * this.mass;
                this.verticalSpeed -= fallingVelocity;

                // calculate new position
                let newX = this.x + this.horisontalSpeed * (timeDifference / 1000);
                let newY = this.y + this.verticalSpeed * (timeDifference / 1000);

                // check collision at new position
                let collidesWith = getColliderAtCoordinates(newX, newY, this.r);
                if (collidesWith) {
                    // calculate the main vector of movement
                    this.speedAtCollision = Math.sqrt(this.horisontalSpeed ** 2 + this.verticalSpeed ** 2);
                    // calculate angle of motion from speed base vectores
                    this.angleOfMotion = getAngle([this.x, this.y], [this.x + this.horisontalSpeed, this.y + this.verticalSpeed]);

                    if (collidesWith[0][0]) {
                        // edge
                        if (this.speedAtCollision > 10) {
                            this.bounceOffAnEdge(collidesWith);
                        } else {
                            let floor = getColliderAtCoordinates(this.x, this.y - 2, this.r);
                            if (floor && floor[0]) {
                                // this.isOnFloor = true;
                            } else {
                                throw new Error('ball has stopped moving eventhough there are no detectible collider under it.');
                            }
                        }
                    } else {
                        // point 
                        this.bounceOffAPoint(collidesWith);
                    }
                } else {
                    // move to new position
                    this.x = newX;
                    this.y = newY;
                }
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

        // subtract speed from the main movement vector
        this.speedAtCollision = this.speedAtCollision * this.elasticity;

        // calculate speed base vectores from angle of motion and the main speed vectore
        this.horisontalSpeed = Math.cos(this.angleOfMotion) * this.speedAtCollision;
        this.verticalSpeed = Math.sin(this.angleOfMotion) * this.speedAtCollision;
    }
    bounceOffAPoint(point) {
        // change angle
        this.angleOfMotion = this.angleOfMotion + Math.PI;

        // subtract speed from the main movement vector
        this.speedAtCollision = this.speedAtCollision * this.elasticity;

        this.horisontalSpeed = Math.cos(this.angleOfMotion) * this.speedAtCollision;
        this.verticalSpeed = Math.sin(this.angleOfMotion) * this.speedAtCollision;
    }
    rollOnEdge(f, t) {
        let angle = getAngle(f[0], f[1])
        if (angle > 0 && angle < Math.PI) {
            angle = angle + Math.PI;
        }
        if (angle > Math.PI / 2 && angle < Math.PI) {
            angle = angle + Math.PI;
        }

        // calculate speed base vectores from angle of motion and the main speed vectore
        this.horisontalSpeed = Math.cos(angle) * this.horisontalSpeed;
        this.verticalSpeed = Math.sin(angle) * this.verticalSpeed;

        this.x = this.x + this.horisontalSpeed * (t / 1000);
        this.y = this.y + this.verticalSpeed * (t / 1000);
    }
    checkIfOnFloor() {
        if (this.verticalSpeed < 10 && this.verticalSpeed > -10) {
            let floor = getColliderAtCoordinates(this.x, this.y - 2, this.r);
            if (floor && floor[0]) {
                let angleOfFloor = getAngle(floor[0], floor[1]);
                if (angleOfFloor < Math.PI / 180 * 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
