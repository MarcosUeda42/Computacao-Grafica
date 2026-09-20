// ==================================================
// CLASS - SCENE
// ==================================================

class Scene {

    constructor(gl, program) {

        this.renderer =
            new Renderer(gl, program);

        // Figura que será exibida
        this.helicopterBody = new HelicopterBody();

        this.helicopterTopShaft = new HelicopterTopShaft();

        this.helicopterTail = new HelicopterTail();

        this.helicopterPropellers = new HelicopterPropellers();

        this.helicopterTailPropeller = new HelicopterTailPropeller();

        this.theta = 0.0;
        this.phi = 0.0;
        this.helice1 = 0.0;
        this.helice2 = 0.0;

        this.xP = 0.0;
        this.yP = 0.0;
        this.setupKeyboard();
    }

    setupKeyboard() {

        document.addEventListener(
            "keydown",
            (event) => {

                switch (event.key) {

                    case "w":
                        this.yP += 0.05;
                        break;

                    case "s":
                        this.yP -= 0.05;
                        break;

                    case "d":
                        this.xP += 0.05;
                        break;

                    case "a":
                        this.xP -= 0.05;
                        break;

                    case "ArrowUp":
                        this.theta += 0.01;
                        break;

                    case "ArrowDown":
                        this.theta -= 0.01;
                        break;

                    case "ArrowRight":
                        this.phi -= 0.01;
                        break;

                    case "ArrowLeft":
                        this.phi += 0.01;
                        break;

                }
            }
        );
    }

    update() {

        this.helice1 += 0.2;
        this.helice2 += 0.2;

        let fixoX = 0.7;
        let fixoY = 0.0; 

        let movimento = m4.translation(this.xP, this.yP, 0.0);

        let rotacaoX = m4.xRotation(this.theta);
        let rotacaoY = m4.yRotation(this.phi);

        let rotacao = m4.multiply(rotacaoX, rotacaoY);

        let transformacao = m4.multiply(movimento, rotacao);

        let rotacaoPropeller = m4.yRotation(this.helice1);

        let transformacaoPropeller = m4.multiply(transformacao, rotacaoPropeller);

        let centro = m4.translation(-fixoX, -fixoY, 0.0);
        let rotacaoTailPropeller = m4.zRotation(this.helice2);
        let cauda = m4.translation(fixoX, fixoY, 0.0);

        let giro = m4.multiply(cauda, m4.multiply(rotacaoTailPropeller, centro));

        let transformacaoTailPropeller = m4.multiply(transformacao, giro);

        this.helicopterBody.update(transformacao);
        this.helicopterTopShaft.update(transformacao);
        this.helicopterTail.update(transformacao);
        this.helicopterPropellers.update(transformacaoPropeller);
        this.helicopterTailPropeller.update(transformacaoTailPropeller);
    }

    draw() {

        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT
        );

        gl.useProgram(program);

        this.helicopterBody.draw(
            this.renderer
        );

        this.helicopterTopShaft.draw(
            this.renderer
        );

        this.helicopterTail.draw(
            this.renderer
        );

        this.helicopterPropellers.draw(
            this.renderer
        );

        this.helicopterTailPropeller.draw(
            this.renderer
        );
    }

    execute() {

        this.update();
        this.draw();

        requestAnimationFrame(
            () => this.execute()
        );
    }

    init() {

        requestAnimationFrame(
            () => this.execute()
        );
    }
}
