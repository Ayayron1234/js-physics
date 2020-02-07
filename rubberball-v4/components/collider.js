import Polygon from './polygon.js';

export var colliders = [];

export var getColliderAtCoordinates = (x, y, r) => {
    let collidesWith;
    colliders.forEach(o => {
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

export var getCollidersAtCoordinates = (location, r) => {
    let x = location[0],
        y = location[1],
        collidesWith = [];
    colliders.forEach(o => {
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
                collidesWith.push({ c: edge, d: distance, type: 'edge' });
            }
        });
        o.forEachPoint(point => {
            let P = { x: x, y: y },
                A = { x: point[0], y: point[1] };

            let AP = Math.sqrt((A.x - P.x) ** 2 + (A.y - P.y) ** 2);

            if (AP <= r) {
                collidesWith.push({ c: point, d: AP, type: 'point' });
            }
        });
    });
    return collidesWith;
}

export default class Collider extends Polygon {
    constructor(v) {
        super(v);
        colliders.push(this);
    }
}
