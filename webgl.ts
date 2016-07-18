import array = require('./src/array');
import object = require('./src/object');
import either = require('./src/monads/either');
import buffer = require('./src/webgl/buffer');
import shader = require('./src/webgl/shader');

let create = (bounds: { width: number, height: number }) => {
    let canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    return canvas;
};

let canvas: HTMLCanvasElement = create({ width: 512, height: 512 });
let div = document.createElement("div");
div.appendChild(canvas);
document.body.appendChild(div);

// setup
let gl = <WebGLRenderingContext>canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// shaders
let vertexShaderSource =
    `attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying highp vec2 vTextureCoord;
    void main(void) {
        vTextureCoord = aTextureCoord;
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    }`;

let fragmentShaderSource =
    `varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
       gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }`;

let _program = shader.compileProgram(vertexShaderSource, fragmentShaderSource)(gl);
console.log('Error', _program.left);
let shaderProgram = _program.right;

let totalAttributes = <number>gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
for (var index = 0; index < totalAttributes; index++) {
    console.log(index, gl.getActiveAttrib(shaderProgram, index));    
}

let totalUniforms = <number>gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
for (var index = 0; index < totalUniforms; index++) {
    console.log(index, gl.getActiveUniform(shaderProgram, index));    
}

// vertices
type Vertex = { x: number, y: number };
let vertexToPoints = object.toArray<number>(["x", "y"]);

type Quad = { topLeft: Vertex, topRight: Vertex, bottomLeft: Vertex, bottomRight: Vertex };
let quadToVertices = object.toArray<Vertex>(["topLeft", "topRight", "bottomLeft", "bottomRight"]);

let quadToPoints = (quad: Quad) => array.bind(quadToVertices(quad), vertexToPoints);

let quad = {
    topLeft: { x: -1, y: 1 },
    topRight: { x: 1, y: 1 },
    bottomLeft: { x: -1, y: -1 },
    bottomRight: { x: 1, y: -1 }
};

let verticesBuffer = buffer.toBuffer(new Float32Array(quadToPoints(quad)), gl);

buffer.bindBufferToAttribute(gl,
    verticesBuffer, 2,
    shaderProgram, "aVertexPosition"
);

// color
/*let colors = [
    1, 1, 1, 1,
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1
];
let squareVerticesColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

let vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
gl.enableVertexAttribArray(vertexColorAttribute);
gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);*/

// texture

let texture = gl.createTexture();
let image = new Image();
image.crossOrigin = "anonymous";
image.onload = () => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    gl.useProgram(shaderProgram);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    let textureCoords = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];

    let textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

    let aTextureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(aTextureCoord);
    gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    // drawing

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

};

image.src = "resources/plane32.png";