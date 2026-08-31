const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


const canvasCoordinates =
    document.getElementById(
        "canvasCoordinates"
    );

const webglCoordinates =
    document.getElementById(
        "webglCoordinates"
    );


// --------------------------------------------------
// 1. VERTICES
// --------------------------------------------------

let vertices = [];


// --------------------------------------------------
// 1. CORES
// --------------------------------------------------

let colors = [];
let currentColor = [1.0, 0.0, 0.0];

// --------------------------------------------------
// 1. TAMANHO DOS PONTOS
// --------------------------------------------------

let pointSizes = [];

let click = [];
// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
);

const colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);

const pointSizesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    pointSizes,
    gl.STATIC_DRAW
);

// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;
in float aPointSize;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = aPointSize;
    vColor = aColor;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
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
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );

const pointSizeLocation =
    gl.getAttribLocation(
        program,
        "aPointSize"
    );

// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.enableVertexAttribArray(pointSizeLocation);

gl.vertexAttribPointer(
    pointSizeLocation,
    1,
    gl.FLOAT,
    false,
    0,
    0
);

// --------------------------------------------------
// 9. INTERAÇÃO COM O MOUSE
// --------------------------------------------------

function bresenham(x0, y0, x1, y1) {
    const points = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        points.push({ x: x0, y: y0 }); 

        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return points;
}


document.addEventListener(
  "keydown",
  keyboardClick,
  false
);

function keyboardClick(event) {

  switch(event.key) {
      case "0":
          currentColor = new Float32Array([
              1.0, 1.0, 1.0
          ]);
          colorBox.style.backgroundColor = "white";
          break;

      case "1":
          currentColor = new Float32Array([
              1.0, 0.0, 0.0
          ]);
          colorBox.style.backgroundColor = "red";
          break;

      case "2":
          currentColor = new Float32Array([
              0.0, 1.0, 0.0
          ]);
          colorBox.style.backgroundColor = "green";
          break;

      case "3":
          currentColor = new Float32Array([
              0.0, 0.0, 1.0
          ]);
          colorBox.style.backgroundColor = "blue";
          break;

      case "4":
          currentColor = new Float32Array([
              1.0, 1.0, 0.0
          ]);
          colorBox.style.backgroundColor = "yellow";
          break;

      case "5":
          currentColor = new Float32Array([
              1.0, 0.0, 1.0
          ]);
          colorBox.style.backgroundColor = "magenta";
          break;

      case "6":
          currentColor = new Float32Array([
              0.0, 1.0, 1.0
          ]);
          colorBox.style.backgroundColor = "cyan";
          break;

      case "7":
          currentColor = new Float32Array([
              1.0, 0.5, 0.0
          ]);
          colorBox.style.backgroundColor = "orange";
          break;

      case "8":
          currentColor = new Float32Array([
              0.5, 0.0, 1.0
          ]);
          colorBox.style.backgroundColor = "purple";
          break;

      case "9":
          currentColor = new Float32Array([
              1.0, 0.4, 0.7
          ]);
          colorBox.style.backgroundColor = "pink";
          break;

      default:
          return;
  }
  // Recria o array de cores preenchendo todos os vértices atuais com a nova cor
  colors = [];
  for (let i = 0; i < vertices.length / 2; i++) {
      colors.push(currentColor[0], currentColor[1], currentColor[2]);
  }

  // Atualizar o buffer de cores
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Redesenhar
  drawScene();
}

canvas.addEventListener("mousedown",mouseClick,false);
  
function mouseClick(event){

    // Posição do clique em pixels
    const x = event.offsetX;
    const y = event.offsetY;

    canvasCoordinates.textContent =
        `Canvas: (${x}, ${y})`;

    // Converter X para o intervalo [-1, 1]
    const webglX =
        (x / canvas.width) * 2 - 1;

    // Converter Y para o intervalo [-1, 1]
    // O sinal é invertido porque o eixo Y do canvas
    // cresce para baixo e o do WebGL cresce para cima
    const webglY =
        -((y / canvas.height) * 2 - 1);

    webglCoordinates.textContent =
        `WebGL: (${webglX.toFixed(3)}, ${webglY.toFixed(3)})`;

    if (click.length >= 2) {
        click = [];
    }

    click.push({x: x, y: y});

    vertices = [];
    colors = [];
    pointSizes = [];

    let pontosParaDesenhar = [];

    if (click.length === 1) {
        pontosParaDesenhar.push(click[0]);
    } else if (click.length === 2) {
        const p1 = click[0];
        const p2 = click[1];
        pontosParaDesenhar = bresenham(p1.x, p1.y, p2.x, p2.y);
    }

    for (let i = 0; i < pontosParaDesenhar.length; i++) {
        const px = pontosParaDesenhar[i].x;
        const py = pontosParaDesenhar[i].y;

        const webglX = (px / canvas.width) * 2 - 1;
        const webglY = -((py / canvas.height) * 2 - 1);

        vertices.push(webglX, webglY);
        colors.push(currentColor[0], currentColor[1], currentColor[2]);
        
        pointSizes.push(3.0); 
    }

    // Atualizar o conteúdo do buffer na GPU
    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        colorsBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW
    );

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        pointSizesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(pointSizes),
        gl.STATIC_DRAW
    );

    // Redesenhar a cena
    drawScene();
}

// --------------------------------------------------
// 10. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 11. DESENHAR
// --------------------------------------------------

const numComponents = 2;

gl.useProgram(program);

function drawScene(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.drawArrays(
        gl.POINTS,
        0,
        vertices.length / numComponents
    );
}

drawScene();