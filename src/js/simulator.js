const canvas = document.getElementById("canvas");
const canvas_container = document.getElementById("canvas-container");
const ctx = canvas.getContext("2d");
let pts = [];

function onAnimationFrame() {
    syncCanvasSize();
    update();
    render();

    requestAnimationFrame(onAnimationFrame);
}

function syncCanvasSize() {
    canvas.width = canvas_container.clientWidth;
    canvas.height = canvas_container.clientWidth;

}

function update(){
    updateBody(body1);
    updateBody(body2);

    applyGravity(body1, body2);
    applyGravity(body2, body1);
}

function render() {
    renderBody(body1);
    renderBody(body2);

    drawPoints();
}

function drawPoints(){
    pts.forEach(pt => {
        ctx.fillStyle = "white";
        ctx.fillRect(pt.x, pt.y, 3, 3);
    });
}

setInterval(function(){
    pts.push({
        "x": body1.x,
        "y": body1.y,
    });
}, 1000);

//
// Physics Code
//

let body1 = createBody("Body1", 1_000, 10, 300, 400, "red");
body1.yVel = 2.3;
let body2 = createBody("Body2", 500_000_000_000, 25, 400, 400, "yellow");

function createBody(name, mass, radius, x, y, color){
    if(!name || !mass || !radius || !x || !y || !color)
        throw new Error("Unallowed null/undefined component");

    return {
        "name": name,
        "radius": radius,
        "x": x,
        "y": y,
        "mass": mass,
        "color": color,
        "xVel": 0.0,
        "yVel": 0.0,
    }
}

function applyGravity(body1, body2){
    const G = 6.675e-10;
    let xDiff = Math.abs(body1.x - body2.x);
    let yDiff = Math.abs(body1.y - body2.y);

    let r = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    if(r < 50){
        return;
    }

    let F = G * ((body1.mass * body2.mass) / Math.pow(r, 2));

    let angle = Math.atan2(yDiff, xDiff);
    let fVector = createVectorMagAngle(angle, F);
    fVector.divide(new Vector(body1.mass, body1.mass));
    
    body1.xVel += fVector.x * (body1.x > body2.x ? -1: 1);
    body1.yVel += fVector.y * (body1.y > body2.y ? -1: 1);
}

function updateBody(body){
    body.x += body.xVel;
    body.y += body.yVel;
}

function renderBody(body){
    ctx.fillStyle = body.color;
    ctx.beginPath();
    ctx.ellipse(body.x, body.y, body.radius, body.radius, 0, 0, 2 * Math.PI);
    ctx.fill();
}

//
// Vector Code
//

class Vector{
    constructor(x, y){
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector){
        this.x -= vector.x;
        this.y -= vector.y;
    }

    divide(vector){
        this.x /= vector.x;
        this.y /= vector.y;
    }

    getMagnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    getAngle(){
        return Math.atan2(this.y, this.x);
    }

    print(){
        console.log("(" + this.x + ", " + this.y + ")")
    }
}

function createVectorMagAngle(angle, mag){
    return new Vector(Math.cos(angle) * mag, Math.sin(angle) * mag);
}

requestAnimationFrame(onAnimationFrame);
