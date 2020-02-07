import canvas from './canvas.js';
import GameObject from './gameobject.js';

export default class Polygon extends GameObject {
    constructor(v) {
        super();
        this.vertices = v;

        canvas.objectsToRender.push(this);
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
    render() {
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(this.vertices[this.vertices.length - 1][0], this.vertices[this.vertices.length - 1][1]);
        this.vertices.forEach(vertex => {
            canvas.ctx.lineTo(vertex[0], vertex[1]);
        });
        canvas.ctx.stroke();
    }
}
