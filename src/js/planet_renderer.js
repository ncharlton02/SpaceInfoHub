/*
* WebGL 
*/
var cubeRotation = 0.0;
const numLayers = 50; 
const numSlices = 50;
const maxSize = 550;

const canvas = document.querySelector("#planet-canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

function main() {
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;
        
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;

            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.7));

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `;
    const fsSource = `
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform sampler2D uSampler;

        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

            gl_FragColor =  vec4(texelColor.rgb * vLighting, texelColor.a);
        }
    `;
    

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    var texture = loadTexture(gl);
    
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    const buffers = initBuffers(gl);
    
    var then = 0.0;

    function render(now){
        if (updateTexture){
            texture = loadTexture(gl);
            updateTexture = false;
        }

        now *= 0.1;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, texture, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

function resize(canvas) {
    var displayWidth = canvas.clientWidth > maxSize ? maxSize : canvas.clientWidth;
    var displayHeight = canvas.clientHeight > maxSize ? maxSize : canvas.clientHeight;
    displayHeight = displayHeight > displayWidth ? displayWidth : displayHeight;

    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        console.log(canvas.clientWidth);
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram  = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert('Shader initialization failed.\n' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source){

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert('Shader compilation failed.\n' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function loadTexture(gl){
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)){
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    }

    image.src = selectedPlanet.texture;

    return texture;
}

function isPowerOf2(value){
    return !(value & (value - 1));
}

function initBuffers(gl){
    const positionBuffer = gl.createBuffer();
    const textureCoordBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();

    var positions = [];
    var textureCoordinates = [];
    var indices = [];

    var lat = 0;
    var lon = 0;

    for (var i = 0; i < numLayers + 1; i++){
        for (var j = 0; j < numSlices + 1; j++){
            lat = Math.PI / 2 * (1 - 2 * i / numLayers);
            lon = Math.PI * 2 * j / numSlices;
            positions[i*(numSlices+1)*3+j*3] = Math.cos(lat) * Math.cos(lon);
            positions[i*(numSlices+1)*3+j*3+1] = Math.sin(lat);
            positions[i*(numSlices+1)*3+j*3+2] = Math.cos(lat) * Math.sin(Math.PI * 2 * j / numSlices);
            
            textureCoordinates[i*(numSlices+1)*2+j*2] = 1 - j / numSlices;
            textureCoordinates[i*(numSlices+1)*2+j*2+1] = i / numLayers;
        }
    }

    for (var i = 0; i < numLayers; i++){
        for (var j = 0; j < numSlices; j++){
            indices[i*numSlices*6+j*6] = i*(numSlices+1)+j;
            indices[i*numSlices*6+j*6+1] = (i+1)*(numSlices+1)+j;
            indices[i*numSlices*6+j*6+2] = (i+1)*(numSlices+1)+j+1;
            indices[i*numSlices*6+j*6+3] = i*(numSlices+1)+j;
            indices[i*numSlices*6+j*6+4] = i*(numSlices+1)+j+1;
            indices[i*numSlices*6+j*6+5] = (i+1)*(numSlices+1)+j+1;
        }
    }

    console.log(positions);
    console.log(textureCoordinates);
    console.log(indices);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    //Note: A sphere is a special case where the vertex normals are the same as the positions, which saves us some pre-processing.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        normal:normalBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
    };
}

function drawScene(gl, programInfo, buffers, texture, deltaTime){
    resize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.078, 0.078, 0.078, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = Math.PI / 8;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
                        fieldOfView,
                        aspect,
                        zNear,
                        zFar);

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    //mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation*Math.PI/180, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI/4*Math.sin(cubeRotation*Math.PI/180 * 0.2), [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation*Math.PI/180 * 0.6, [0, 1, 0]);

    const normalMatrix = mat4.create();

    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
        const num = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            num,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexNormal);
    }

    

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    const offset = 0;
    const vertexCount = 4;
    //gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        const vertexCount = numLayers*numSlices*6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    cubeRotation += deltaTime;
}

main();