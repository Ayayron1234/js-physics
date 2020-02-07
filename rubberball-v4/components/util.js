import canvas from "./canvas.js";
import GameObject from "./canvas.js";

const getAngle = (a) => {
    let c = [a[1][0] - a[0][0], a[1][1] - a[0][1]];
    if (c[0] === 0) {
        if (c[1] > 0) {
            return Math.PI / 2;
        } else if (c[1] < 0) {
            return Math.PI * 3 / 2;
        } else {
            return 0;
        }
    } else {
        if (c[0] > 0) {
            var angle = Math.atan(c[1] / c[0]);
        } else {
            var angle = Math.atan(c[1] / c[0]) + Math.PI;
        }
        if (angle < 0)
            angle += Math.PI * 2;
        return angle;
    }
}

const getLengthOfSection = (s) => {
    return Math.sqrt((s[1][0] - s[0][0]) ** 2 + (s[1][1] - s[0][1]) ** 2);
}

export class Line {
    constructor(v) {
        this.vertices = v;

        canvas.objectsToRenderOnce.push(this);
    }
    render() {
        document.getElementById('console').innerHTML = this.vertices
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(this.vertices[this.vertices.length - 1][0], this.vertices[this.vertices.length - 1][1]);
        this.vertices.forEach(vertex => {
            canvas.ctx.lineTo(vertex[0], vertex[1]);
        });
        canvas.ctx.stroke();
    }
}

export class Vector {
    constructor(c) {
        this.c = c;
    }

    static add(a, b) {
        return new Vector([a.c[0] + b.c[0], a.c[1] + b.c[1]]);
    }

    get length() {
        return Math.sqrt(this.c[0] ** 2 + this.c[1] ** 2);
    }
    set length(l) {
        let angle = this.angle;
        this.c = [Math.cos(angle) * l, Math.sin(angle) * l];
    }
    get angle() {
        if (this.c[0] === 0) {
            if (this.c[1] > 0) {
                return Math.PI / 2;
            } else if (this.c[1] < 0) {
                return Math.PI * 3 / 2;
            } else {
                return 0;
            }
        } else {
            if (this.c[0] > 0) {
                var angle = Math.atan(this.c[1] / this.c[0]);
            } else {
                var angle = Math.atan(this.c[1] / this.c[0]) + Math.PI;
            }
            if (angle < 0)
                angle += Math.PI * 2;
            return angle;
        }
    }
    set angle(alpha) {
        this.c = [Math.cos(alpha) * this.length, Math.sin(alpha) * this.length];
    }

    rotateBy(alpha) {
        let v = new Vector(this.c);
        v.angle += alpha;
        return v;
    }
    multiplyByNumber(n) {
        let v = new Vector(this.c);
        v.c = [v.c[0] * n, v.c[1] * n];
        return v;
    }
    calculateProjectionToSection(s) {
        let angleOfSection = getAngle(s);

        let rotatedVector = new Vector(this.c).rotateBy(-angleOfSection);

        let resVector = new Vector([rotatedVector.c[0], 0]);
        if (rotatedVector.c[1] > 0) {
            resVector = rotatedVector;
        }

        return resVector.rotateBy(angleOfSection);
    }
    calculateParalelVectorToSection(s) {
        let angleOfSection = getAngle(s);

        let rotatedVector = new Vector(this.c).rotateBy(-angleOfSection);

        let resVector = new Vector([0, rotatedVector.c[1]]);
        if (rotatedVector.c[1] > 0) {
            resVector = rotatedVector.multiplyByNumber(0);
        }

        return resVector.rotateBy(angleOfSection);
    }
}

export { getAngle, getLengthOfSection }
