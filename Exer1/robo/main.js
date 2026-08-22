const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VÉRTICES
// --------------------------------------------------

const rosto = new Float32Array([
    -0.8,  0.8,
     0.8,  0.8,
    -0.8, -0.8,
     0.8, -0.8
]);

const olho_esquerdo = new Float32Array([
    -0.3,  0.4,
    -0.5,  0.2,
    -0.1, 0.2,
]);

const olho_direito = new Float32Array([
    0.1,  0.4,
    0.4,  0.4,
    0.1, 0.2,
    0.4, 0.2
]);

const boca = new Float32Array([
    -0.4, -0.4,
     0.4, -0.4,
    -0.4, -0.6,
     0.4, -0.6
]);

const numSegments = 32;
const raio = 0.12;
const nariz = new Float32Array((numSegments + 2) * 2);
const cx = 0.0;
const cy = 0.0;
nariz[0] = cx;
nariz[1] = cy;

for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * 2 * Math.PI;
    
    const index = (i + 1) * 2;
    nariz[index] = cx + raio * Math.cos(angle);
    nariz[index + 1] = cy + raio * Math.sin(angle);
}

// --------------------------------------------------
// 2. BUFFER
// --------------------------------------------------

const faceBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, faceBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    rosto,
    gl.STATIC_DRAW
);

const olho_esquerdoBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, olho_esquerdoBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    olho_esquerdo,
    gl.STATIC_DRAW
);

const olho_direitoBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, olho_direitoBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    olho_direito,
    gl.STATIC_DRAW
);

const bocaBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, bocaBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    boca,
    gl.STATIC_DRAW
);

const narizBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, narizBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    nariz,
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
// 9. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

const colorLocation = gl.getUniformLocation(program, "uColor");

gl.useProgram(program);

// rosto
gl.bindBuffer(gl.ARRAY_BUFFER, faceBuffer);

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

// olhos
gl.bindBuffer(gl.ARRAY_BUFFER, olho_esquerdoBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [0.0, 0.0, 1.0, 1.0]);

gl.drawArrays(gl.TRIANGLES, 0, 3);


gl.bindBuffer(gl.ARRAY_BUFFER, olho_direitoBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [0.0, 0.0, 1.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


gl.bindBuffer(gl.ARRAY_BUFFER, bocaBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [0.0, 1.0, 0.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


gl.bindBuffer(gl.ARRAY_BUFFER, narizBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.uniform4fv(colorLocation, [1.0, 1.0, 0.0, 1.0]);

gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);