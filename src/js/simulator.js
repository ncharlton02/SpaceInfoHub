const simulations = [
    {
        "name": "One Planet",
        "onInit": function () {
            createBody("Earth", 100_000, 10, 200, 250, "green", 0, 4.2);
            createBody("Sun", 5_000_000_000, 25, 400, 250, "yellow", 0, 0);
        }
    },
    {
        "name": "Unstable Binary System",
        "onInit": function () {
            createBody("Star 2", 5_000_000_000, 25, 300, 350, "yellow", 0, 3);
            createBody("Star 2", 5_000_000_000, 25, 500, 350, "yellow", 0, -3);
            createBody("Planet", 100_000, 10, 100, 350, "orange", 0, 3.5);
        }
    },
    {
        "name": "Elliptical Planets (No Collision)",
        "onInit": function () {
            createBody("Planet 1", 1000, 10, 400, 50, "green", -3, 0);
            createBody("Planet 2", 1000, 10, 400, 50, "orange", -2.8, 0);
            createBody("Planet 3", 1000, 10, 400, 50, "red", -2.5, 0);
            createBody("Planet 4", 1000, 10, 400, 50, "blue", -2.25, 0);
            createBody("Planet 5", 1000, 10, 400, 50, "white", -2, 0);
            createBody("Planet 6", 1000, 10, 400, 50, "gray", -1.75, 0);
            createBody("Planet 6", 1000, 10, 400, 50, "purple", -1.5, 0);
            createBody("Sun", 5_000_000_000, 25, 400, 400, "yellow", 0, 0);
        }
    },
    {
        "name": "Multiple Planets",
        "onInit": function () {
            createBody("Planet 1", 100_000, 10, 350, 350, "blue", 0, 8.2);
            createBody("Planet 2", 100_000, 10, 300, 350, "red", 0, 6.2);
            createBody("Planet 3", 100_000, 10, 200, 350, "green", 0, 4.2);
            createBody("Comet", 1_000, 3, 100, 100, "white", 0, 1.5);
            createBody("Sun", 5_000_000_000, 25, 400, 350, "yellow", 0, 0);
        }
    },
    {
        "name": "Custom Simulation",
        "onInit": function () {
            simulationBuilder.style = "";
            buildCustomSimulation();
        },
        "onEnd": function () {
            simulationBuilder.style = "display:none";
        }
    },
]
//
// Custom Simulation Stuff
// 

let blockText = `   
<form class="simulation-form p-3 m-3">
    <div>
        <h5 class="pr-3" style="display:inline-block">Name</h5>
        <input id="body-name-box" value="Name" style="display:inline-block" type="text">
    </div>
    <div>
        <h5 class="pr-3" style="display:inline-block">Color</h5>
        <input id="body-color-box" value="#FF0000" style="display:inline-block" type="color">
    </div>
    <div>
        <h5 class="pr-3" style="display:inline-block">Mass</h5>
        <input id="body-mass-box" value="100" style="display:inline-block" type="number">
    </div>
    <div>
        <h5 class="pr-3" style="display:inline-block">Radius</h5>
        <input id="body-radius-box" value="20" style="display:inline-block" type="number">
    </div>
    <div class="pt-4">
        <h5 class="pr-3" style="display:inline-block">Initial X</h5>
        <input id="body-ix-box" value="100" style="display:inline-block" type="number">
    </div>
    <div>
        <h5 class="pr-3" style="display:inline-block">Initial Y</h5>
        <input id="body-iy-box" value="100" style="display:inline-block" type="number">
    </div>
    <div class="pt-4">
        <h5 class="pr-3" style="display:inline-block">Initial Vel-X</h5>
        <input id="body-ivelx-box" value="0" style="display:inline-block" type="number">
    </div>
    <div>
        <h5 class="pr-3" style="display:inline-block">Initial Vel-Y</h5>
        <input id="body-ively-box" value="0" style="display:inline-block" type="number">
    </div>
</form>`;

const simulationBuilder = document.getElementById("simulation-builder");
const bodyBuilderContainer = document.getElementById("body-builder-container");
addBodyToBuilder();

function addBodyToBuilder() {
    bodyBuilderContainer.insertAdjacentHTML("beforeend", blockText);
}

function clearBodyBuilder() {
    bodyBuilderContainer.innerHTML = blockText;
}

function buildCustomSimulation() {
    let bodyForms = bodyBuilderContainer.getElementsByClassName("simulation-form");
    
    Array.from(bodyForms).forEach(form => parseBodyForm(form));
}

function parseBodyForm(form){
    function nonNull(x){
        if(!x){
            throw new Error();
        }

        return x;
    }

    try{
        let name = nonNull(form.querySelector("#body-name-box").value);
        let color = nonNull(form.querySelector("#body-color-box").value);
        let mass = nonNull(form.querySelector("#body-mass-box").value) * 10e5;
        let radius = nonNull(form.querySelector("#body-radius-box").value);
        let initalX = nonNull(form.querySelector("#body-ix-box").value);
        let initalY = nonNull(form.querySelector("#body-iy-box").value);
        let initalVelX = nonNull(form.querySelector("#body-ivelx-box").value);
        let initalVelY = nonNull(form.querySelector("#body-ively-box").value);

        createBody(name, mass, radius, initalX, initalY, color, initalVelX, initalVelY);
    }catch(e){
        console.log(e);
        form.style = "border: red solid thin";

        return;
    }

    form.style = "";
}

//
// Generic Code
//

const simulationSelect = document.getElementById("simulation-selctor");

initSimulationSelector();

function initSimulationSelector() {
    let html = [];

    for (var i = 0; i < simulations.length; i++) {
        html.push('<option value="' + i + '">');
        html.push(simulations[i].name);
        html.push("</option>");
    }

    simulationSelect.innerHTML = html.join("");
}

function onSimulationSelected() {
    applySimulation(simulations[simulationSelect.value]);
}

//
// Simulator
//
const distanceScale = 100_000;
const massScale = 1_000_000_000_000_000_000;

const simulationName = document.getElementById("simulation-name");
const canvas = document.getElementById("canvas");
const canvas_container = document.getElementById("canvas-container");
const ctx = canvas.getContext("2d");
let pts = [];
let bodies = [];
let simulation;

function onAnimationFrame() {
    syncCanvasSize();
    update();
    render();

    requestAnimationFrame(onAnimationFrame);
}

function applySimulation(s) {
    if (simulation && simulation.onEnd)
        simulation.onEnd();

    simulation = s;
    bodies = [];
    pts = [];

    simulationName.innerHTML = "Current Simulation: " + simulation.name;
    simulation.onInit();
}

function update() {
    bodies.forEach(b => updateBody(b));
}

function syncCanvasSize() {
    canvas.width = canvas_container.clientWidth;
    canvas.height = canvas_container.clientHeight;

}

function render() {
    drawPoints();
    bodies.forEach(b => renderBody(b));
}

function drawPoints() {
    pts.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
    });
}

setInterval(function () {
    bodies.forEach(b => {
        pts.push({
            "x": b.x / distanceScale,
            "y": b.y / distanceScale,
            "color": b.color,
        });
    });

}, 250);

//
// Physics Code
//

function createBody(name, mass, radius, x, y, color, xVel, yVel) {
    if (!name || !mass || !radius || !x || !y || !color)
        throw new Error("Unallowed null/undefined component");

    let body = {
        "name": name,
        "radius": radius,
        "x": x * distanceScale,
        "y": y * distanceScale,
        "mass": mass * massScale,
        "color": color,
        "xVel": xVel ? (xVel * distanceScale) : 0.0,
        "yVel": yVel ? (yVel * distanceScale) : 0.0,
    }

    bodies.push(body);

    return body;
}

function applyGravity(body1, body2) {
    const G = 6.675e-10;
    let xDiff = Math.abs(body1.x - body2.x);
    let yDiff = Math.abs(body1.y - body2.y);

    let r = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    let F = G * ((body1.mass * body2.mass) / Math.pow(r, 2));

    let angle = Math.atan2(yDiff, xDiff);
    let fVector = createVectorMagAngle(angle, F);
    fVector.divide(new Vector(body1.mass, body1.mass));

    body1.xVel += fVector.x * (body1.x > body2.x ? -1 : 1);
    body1.yVel += fVector.y * (body1.y > body2.y ? -1 : 1);
}

function updateBody(body) {
    if (!body) {
        console.log(body);
        return;
    }

    body.x += body.xVel;
    body.y += body.yVel;

    bodies.forEach(otherBody => {
        if (body != otherBody) {
            applyGravity(body, otherBody);
        }
    });
}

function renderBody(body) {
    ctx.fillStyle = body.color;
    ctx.beginPath();
    ctx.ellipse(body.x / distanceScale, body.y / distanceScale, body.radius, body.radius, 0, 0, 2 * Math.PI);
    ctx.fill();
}

//
// Vector Code
//

class Vector {
    constructor(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
    }

    getMagnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    print() {
        console.log("(" + this.x + ", " + this.y + ")")
    }
}

function createVectorMagAngle(angle, mag) {
    return new Vector(Math.cos(angle) * mag, Math.sin(angle) * mag);
}

applySimulation(simulations[0]);
requestAnimationFrame(onAnimationFrame);
