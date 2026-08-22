const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VÉRTICES
// --------------------------------------------------

const retan = new Float32Array([                
    -0.2, 0.2,
    0.2, 0.2,
    -0.1, 0.0,
    0.1, 0.0
]);

const caule = new Float32Array([
    -0.02, 0.0,
    0.02, 0.0,
    -0.005, -0.5,
    0.005, -0.5
]);

const folha = new Float32Array([
    0.0, -0.2,
    0.2, -0.1,
    0.1, -0.2
]);


// --------------------------------------------------
// 2. BUFFER
// --------------------------------------------------

const retanBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, retanBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    retan,
    gl.STATIC_DRAW
);

const cauleBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, cauleBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    caule,
    gl.STATIC_DRAW
);

const folhaBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, folhaBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    folha,
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

gl.bindBuffer(gl.ARRAY_BUFFER, retanBuffer);
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


gl.bindBuffer(gl.ARRAY_BUFFER, cauleBuffer);
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


gl.bindBuffer(gl.ARRAY_BUFFER, folhaBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);
gl.uniform4fv(colorLocation, [0.0, 0.5, 0.0, 1.0]);
gl.drawArrays(gl.TRIANGLES, 0, 3);