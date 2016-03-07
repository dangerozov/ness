import maybe = require('./maybe');
import reader = require('./reader');
reader._return(5);

export let compileShader = (gl: WebGLRenderingContext, source: string, type: number) => {
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

export let linkProgram = (gl: WebGLRenderingContext, shaders: WebGLShader[]) => {
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    let attributePosition = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(attributePosition);
    gl.vertexAttribPointer(attributePosition, vertexSize, gl.FLOAT, false, 0, 0);
}