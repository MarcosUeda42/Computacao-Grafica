const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_viewTransform;
uniform mat3 u_modelTransform;

void main() {

    vec3 position =
        u_viewTransform *
        u_modelTransform *
        vec3(aPosition, 1.0);

    gl_Position =
        vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {

    outColor =
        vec4(uColor, 1.0);
}
`;

function createShader(gl, type, source) {

    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (
        !gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        )
    ) {

        const error =
            gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}

function createProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
) {

    const vertexShader =
        createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );

    const fragmentShader =
        createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        vertexShader
    );

    gl.attachShader(
        program,
        fragmentShader
    );

    gl.linkProgram(program);

    if (
        !gl.getProgramParameter(
            program,
            gl.LINK_STATUS
        )
    ) {

        throw new Error(
            gl.getProgramInfoLog(program)
        );
    }

    return program;
}


const program =
    createProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
    );


// ==================================================
// CLASSE RENDERER
// ==================================================

class Renderer {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.positionLocation =
            gl.getAttribLocation(
                program,
                "aPosition"
            );

        this.colorLocation =
            gl.getUniformLocation(
                program,
                "uColor"
            );

        this.viewTransformLocation =
            gl.getUniformLocation(
                program,
                "u_viewTransform"
            );

        this.modelTransformLocation =
            gl.getUniformLocation(
                program,
                "u_modelTransform"
            );

        this.viewTransform =
            m3.identity();

        this.verticesBuffer =
            gl.createBuffer();
    }

    defineViewTransform(viewTransform) {
        this.viewTransform =
            viewTransform;
    }

    draw(object) {
        const gl = this.gl;

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.verticesBuffer
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            object.vertices,
            gl.STATIC_DRAW
        );

        gl.enableVertexAttribArray(
            this.positionLocation
        );

        gl.vertexAttribPointer(
            this.positionLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.uniform3fv(
            this.colorLocation,
            object.color
        );

        gl.uniformMatrix3fv(
            this.modelTransformLocation,
            false,
            object.modelTransform
        );

        gl.uniformMatrix3fv(
            this.viewTransformLocation,
            false,
            this.viewTransform
        );

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            object.vertices.length / 2
        );
    }
}

// ==================================================
// AUXILIARY FUNCTIONS
// ==================================================

function rectangleVertices(x,y,width,height){
    return [
        x, y,
        x+width, y+height,
        x, y+height,

        x, y,
        x+width, y,
        x+width, y+height
    ];
}

function circleVertices(radius,numSegments){
    const vertices = [];

    for (let i = 0; i < numSegments; i++) {
        const theta1 =
            (i / numSegments) *
            2 * Math.PI;

        const theta2 =
            ((i + 1) / numSegments) *
            2 * Math.PI;


        vertices.push(
            0,
            0
        );

        vertices.push(
            radius * Math.cos(theta1),
            radius * Math.sin(theta1)
        );


        vertices.push(
            radius * Math.cos(theta2),
            radius * Math.sin(theta2)
        );
    }

    return vertices;
}

// ==================================================
// corpo robo
// ==================================================

function robotBodyVertices() {
    return new Float32Array(rectangleVertices(-0.15, -0.2, 0.3, 0.4));
}

// ==================================================
// cabeca
// ==================================================

function robotHeadVertices() {
    const vertices = [];
    vertices.push(...rectangleVertices(-0.15, -0.2, 0.3, 0.3));

    return new Float32Array(vertices);
}

// ===================================================
// olhos
// ===================================================

function robotEyeVertices() {
    return new Float32Array(rectangleVertices(-0.05, -0.1, 0.1, 0.1));
}


// ==================================================
// membros
// ==================================================

function robotLimbVertices() {
    return new Float32Array(rectangleVertices(-0.05, -0.35, 0.1, 0.35));
}


// ==================================================
// CLASSE SCENE OBJECT
// ==================================================

class SceneObject {

    constructor(vertices, color) {

        this.vertices = vertices;

        this.color = color; 

        this.modelTransform = m3.identity();
    }

    updateModelTransform(modelTransform) {

        this.modelTransform = modelTransform;
    }
}


// ==================================================
// CLASSE robo
// ==================================================

class Robot {
    constructor(tx, ty, color1, color2, color3, color4) {
        this.tx = tx;
        this.ty = ty;
        this.speed = 0.015;
        this.animationTime = 0.0;

        this.body = new SceneObject(robotBodyVertices(), color1);
        this.leftEyes = new SceneObject(robotEyeVertices(), color4);
        this.rightEyes = new SceneObject(robotEyeVertices(), color3);
        this.head = new SceneObject(robotHeadVertices(), color2);
        
        this.leftArm = new SceneObject(robotLimbVertices(), color2);
        this.rightArm = new SceneObject(robotLimbVertices(), color2);
        
        this.leftLeg = new SceneObject(robotLimbVertices(), color2);
        this.rightLeg = new SceneObject(robotLimbVertices(), color2);
    }

    move() {
        this.tx += this.speed;

        if (this.tx > 1.5 || this.tx < -1.5) {
            this.speed = -this.speed;
        }

        this.animationTime += 0.1;
 
        const ang = Math.sin(this.animationTime) * 0.5;


        const robotTransform = m3.translation(this.tx, this.ty);
        this.body.updateModelTransform(robotTransform);

        const head = m3.translation(0.0, 0.35);
        this.head.updateModelTransform(m3.multiply(robotTransform, head));

        const leftEye = m3.multiply(head, m3.translation(-0.06, 0.05));
        this.leftEyes.updateModelTransform(m3.multiply(robotTransform, leftEye));

        const rightEye = m3.multiply(head, m3.translation(0.06, 0.05));
        this.rightEyes.updateModelTransform(m3.multiply(robotTransform, rightEye));
        
        const leftArm = m3.multiply(
            m3.translation(-0.15, 0.15), 
            m3.rotation(ang)      
        );
        this.leftArm.updateModelTransform(m3.multiply(robotTransform, leftArm));

        const rightArm = m3.multiply(
            m3.translation(0.15, 0.15), 
            m3.rotation(-ang)
        );
        this.rightArm.updateModelTransform(m3.multiply(robotTransform, rightArm));

        const leftLeg = m3.multiply(
            m3.translation(-0.08, -0.2), 
            m3.rotation(-ang)
        );
        this.leftLeg.updateModelTransform(m3.multiply(robotTransform, leftLeg));

        const rightLeg = m3.multiply(
            m3.translation(0.08, -0.2), 
            m3.rotation(ang)
        );
        this.rightLeg.updateModelTransform(m3.multiply(robotTransform, rightLeg));
    }

    draw(renderer) {
        
        renderer.draw(this.leftArm);
        renderer.draw(this.leftLeg);
        
        renderer.draw(this.body);
        renderer.draw(this.head);

        renderer.draw(this.leftEyes);
        renderer.draw(this.rightEyes);
        
        renderer.draw(this.rightLeg);
        renderer.draw(this.rightArm);
    }
}

class Scene {

    constructor(gl, program) {

        this.renderer = new Renderer(gl,program);

        this.viewTransform = m3.setClippingWindow(-2.0,-1.0,2.0,1.0);

        this.renderer.defineViewTransform(this.viewTransform);

        this.robot = new Robot(
            0.0, 0.00,                     
            new Float32Array([0.2, 0.6, 0.8]),    
            new Float32Array([0.7, 0.7, 0.7]),     
            new Float32Array([1.0, 0.0, 0.0]),
            new Float32Array([1.0, 1.0, 0.0])   
        );
    }

    update() {

        this.robot.move();
    }

    draw() {

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        this.robot.draw(this.renderer);
    }

    execute() {

        this.update();

        this.draw();

        requestAnimationFrame(() => this.execute());
    }

    init() {

        requestAnimationFrame(() => this.execute());
    }
}


// ==================================================
// CONFIGURAÇÃO INICIAL DO WEBGL
// ==================================================

gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
);

gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);


// ==================================================
// CRIAR CENA
// ==================================================

const scene =
    new Scene(gl,program);


// ==================================================
// INICIAR ANIMAÇÃO
// ==================================================

scene.init();