import webgl = require('./src/webgl');
import array = require('./src/array');

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
let vertex = [
    "attribute vec2 aVertexPosition;",
    "attribute vec2 aTextureCoord;", 
    
    "varying highp vec2 vTextureCoord;",
    
    "void main(void) {",
    "    vTextureCoord = aTextureCoord;",
    "    gl_Position = vec4(aVertexPosition, 0.0, 1.0);",
    "}"
].join("\n");

let fragment = [
    'varying highp vec2 vTextureCoord;',
        
    'uniform sampler2D uSampler;',
        
    'void main(void) {',
    '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
    '}'
].join('\n');

let vertexShader = webgl.compileShader(gl, vertex, gl.VERTEX_SHADER);
let fragmentShader = webgl.compileShader(gl, fragment, gl.FRAGMENT_SHADER);

let shaderProgram = webgl
    .linkProgram(gl, [vertexShader.value, fragmentShader.value])
    .value;
gl.useProgram(shaderProgram);

// vertices
let quad = {
    topLeft: { x: -1, y: 1 },
    topRight: { x: 1, y: 1 },
    bottomLeft: { x: -1, y: -1 },
    bottomRight: { x: 1, y: -1 }
};
let quadLayout = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
let vertexLayout = ["x", "y"];
let verticesBuffer = new Float32Array(array.bind(array.extract(quadLayout)(quad), array.extract(vertexLayout)));

let squareVerticesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, verticesBuffer, gl.STATIC_DRAW);

webgl.bindBufferToAttribute(gl,
    squareVerticesBuffer, vertexLayout.length,
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