type Maybe<T> = { hasValue: boolean, value: T };
let Just = <T>(value: T) => {
    return { hasValue: true, value: value };
};
let Nothing = <T>() => {
    return { hasValue: false, value: <T>void 0 };
};
let Bind = <T1, T2>(maybe: Maybe<T1>, bind: (value: T1) => Maybe<T2>) => {
    let result: Maybe<T2>;
    if (maybe.hasValue) {
        result = bind(maybe.value);
    }
    else {
        result = Nothing<T2>();
    }
    return result;
};

let create = (bounds: { width: number, height: number }) => {
    let canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    return canvas;
};

let canvas: HTMLCanvasElement = create({ width: 640, height: 480 });
let div = document.createElement("div");
div.appendChild(canvas);
document.body.appendChild(div);

// setup
let gl = <WebGLRenderingContext>canvas.getContext("webgl");

gl.clearColor(0, 0, 0, 1);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.viewport(0, 0, canvas.width, canvas.height);

type Content = { type: string, textContent: string };

let getContent: (id: string) => Maybe<Content> = (id: string) => {
    let result: Maybe<Content>;
    
    let shaderScript = <HTMLScriptElement>document.getElementById(id);
    if (shaderScript === void 0) {
        result = Nothing<Content>();
    }
    else {
        result = Just(shaderScript);
    }
    
    return result;
};

let createShader = (gl: WebGLRenderingContext, content: Content) => {
    let shader: Maybe<WebGLShader>;
    if (content.type == "x-shader/x-fragment") {
        shader = Just(gl.createShader(gl.FRAGMENT_SHADER));
    }
    else if (content.type == "x-shader/x-vertex") {
        shader = Just(gl.createShader(gl.VERTEX_SHADER));
    }
    else {
        shader = Nothing<WebGLShader>();
    }
    
    shader = Bind(shader, shader => {
        let result: Maybe<WebGLShader>;
        
        gl.shaderSource(shader, content.textContent);
        gl.compileShader(shader);
        let compiled: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            result = Nothing<WebGLShader>();
        } else {
            result = Just(shader);
        }
        
        return result;
    });
    
    return shader;
};

let fragmentShader = Bind(
    getContent("shader-fs"),
    content => createShader(gl, content));

let vertexShader = Bind(
    getContent("shader-vs"),
    content => createShader(gl, content));

let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader.value);
gl.attachShader(shaderProgram, fragmentShader.value);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("shader program failed");
}

gl.useProgram(shaderProgram);

// vertices
let vertices = [
    0.5, 0.5, 0,
    -0.5, 0.5, 0,
    0.5, -0.5, 0,
    -0.5, -0.5, 0
];
let squareVerticesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

// color
let colors = [
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
gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

// texture

let texture = gl.createTexture();
let image = new Image();
image.crossOrigin = "anonymous";
image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, texture);
};
image.src = "resources/plane.png";

// drawing

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

