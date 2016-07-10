import maybe = require('./maybe');
import reader = require('./reader');
import object = require('./object');
import array = require('./array');
import string = require('./string');
import func = require('./func');

const objectKeys = array.except(
    object.keys(WebGLRenderingContext.prototype),
    object.keys(WebGLRenderingContext));
console.log(objectKeys);

const _webgl: { [key: string]: any } = {};
objectKeys.forEach(key => {
    const wrapped = func.fromObjectProperty(WebGLRenderingContext.prototype, key);
    _webgl[wrapped.name] = wrapped.value;
});
console.log(_webgl);

export type Vec2 = { x: number, y: number };
export type Attribute<T> = {
    value: T[],
    location: number,
    size: number,
    normalized: boolean,
    stride: number,
    offset: number
};

export let toShader = (source: string, type: number, gl: WebGLRenderingContext) => {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    let compiled: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.warn(`Failed to compile shader: ${ gl.getShaderInfoLog(shader) }`);
        gl.deleteShader(shader);
    }
    
    let result = compiled 
        ? maybe.just(shader)
        : maybe.nothing<WebGLShader>();
    
    return result;
};

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