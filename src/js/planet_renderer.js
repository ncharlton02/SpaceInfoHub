const canvas = document.getElementById("planet-canvas");
const ctx = canvas.getContext("2d");

function render(){
    updateCanvasSize();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(render);
}

function updateCanvasSize(){
    canvas.height = canvas.width;
}

requestAnimationFrame(render);
