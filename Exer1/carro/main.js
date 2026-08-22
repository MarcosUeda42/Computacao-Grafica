const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VÉRTICES
// --------------------------------------------------

const numSegments = 32;
const raio = 0.12;
const roda1 = new Float32Array((numSegments + 2) * 2);
const cx1 = 0.4;
const cy1 = 0.0;
roda1[0] = cx1;
roda1[1] = cy1;

for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * 2 * Math.PI;
    
    const index = (i + 1) * 2;
    roda1[index] = cx1 + raio * Math.cos(angle);
    roda1[index + 1] = cy1 + raio * Math.sin(angle);
}


const roda2 = new Float32Array((numSegments + 2) * 2);
const cx2 = -0.4;
const cy2 = 0.0;
roda2[0] = cx2;
roda2[1] = cy2;

for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * 2 * Math.PI;
    
    const index = (i + 1) * 2;
    roda2[index] = cx2 + raio * Math.cos(angle);
    roda2[index + 1] = cy2 + raio * Math.sin(angle);
}

const carro1 = new Float32Array([
    -0.5, 0.2,
    0.6, 0.2,
    -0.6, 0.0,
    0.6, 0.0
]);

const carro2 = new Float32Array([
    -0.2, 0.4,
    0.4, 0.4,
    -0.3, 0.2,
    0.4, 0.2
]);

const janela1 = new Float32Array([
    -0.17, 0.37,
    0.0, 0.37,
    -0.25, 0.2,
    0.0, 0.2
]);

const janela2 = new Float32Array([
    0.05, 0.37,
    0.35, 0.37,
    0.05, 0.2,
    0.35, 0.2
]);

// --------------------------------------------------
// 2. BUFFER
// --------------------------------------------------
const rodaBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, rodaBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    roda1,
    gl.STATIC_DRAW
);

const roda2Buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, roda2Buffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    roda2,
    gl.STATIC_DRAW
);

const carro1Buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, carro1Buffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    carro1,
    gl.STATIC_DRAW
);

const carro2Buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, carro2Buffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    carro2,
    gl.STATIC_DRAW
);

const janela1Buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, janela1Buffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    janela1,
    gl.STATIC_DRAW
);

const janela2Buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, janela2Buffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    janela2,
    gl.STATIC_DRAW
);

// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;
uniform vec4 uColor;

void main() {
    outColor = uColor;
}

`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DO ATRIBUTO
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );




// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

const colorLocation = gl.getUniformLocation(program, "uColor");

gl.useProgram(program);


gl.bindBuffer(gl.ARRAY_BUFFER, rodaBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [0.0, 0.0, 0.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);


gl.bindBuffer(gl.ARRAY_BUFFER, roda2Buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [0.0, 0.0, 0.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);


gl.bindBuffer(gl.ARRAY_BUFFER, carro1Buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [1.0, 0.0, 0.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


gl.bindBuffer(gl.ARRAY_BUFFER, carro2Buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [1.0, 0.0, 0.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


gl.bindBuffer(gl.ARRAY_BUFFER, janela1Buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0  
);

gl.uniform4fv(colorLocation, [1.0, 1.0, 1.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


gl.bindBuffer(gl.ARRAY_BUFFER, janela2Buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [1.0, 1.0, 1.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);