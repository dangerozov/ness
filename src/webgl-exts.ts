import maybe = require('./monads/maybe');
import webgl = require('./webgl');
import reader = require('./monads/reader');

export type Vec2 = { x: number, y: number };
export type Attribute<T> = {
    value: T[],
    location: number,
    size: number,
    normalized: boolean,
    stride: number,
    offset: number
};

export let toShader = (source: string, type: number) => reader.bind(reader.bind(reader.bind(
    webgl.createShader(type),
    shader => gl => { webgl.shaderSource(shader, source)(gl); return shader; }),
    shader => gl => { webgl.compileShader(shader)(gl); return shader; } ),
    shader => gl => { 
        let compiled: boolean = webgl.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS)(gl);
        if (!compiled) {
            console.warn(`Failed to compile shader: ${ gl.getShaderInfoLog(shader) }`);
            webgl.deleteShader(shader)(gl);
        }

        return compiled
            ? maybe.just(shader)
            : maybe.nothing<WebGLShader>();
    });

export let toProgram = (shaders: WebGLShader[], gl: WebGLRenderingContext) => {
    let program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    
    let linked: boolean = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        console.warn(`Failed to link program: ${ gl.getProgramInfoLog(program) }`);
        gl.deleteProgram(program);
    }
    
    let result = linked
        ? maybe.just(program)
        : maybe.nothing<WebGLProgram>();
    
    return result;
};

export let bindBufferToAttribute = (gl: WebGLRenderingContext, buffer: WebGLBuffer, vertexSize: number, program: WebGLProgram, name: string) => {
    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer);
    
    let attributePosition = gl.getAttribLocation(program, name);
    console.log(name, attributePosition);
    gl.enableVertexAttribArray(attributePosition);
    gl.vertexAttribPointer(attributePosition, vertexSize, gl.FLOAT, false, 0, 0);
};

export let toBuffer = (array: ArrayBuffer | ArrayBufferView, gl: WebGLRenderingContext) => {
    let buffer = gl.createBuffer();
    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer);
    gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, array, WebGLRenderingContext.STATIC_DRAW);

    return buffer;
};