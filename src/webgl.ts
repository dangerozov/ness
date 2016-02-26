import maybe = require('./maybe');

export let compileShader = (gl: WebGLRenderingContext, source: string, type: number) => {
    let result: maybe.Maybe<WebGLShader>;
    
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    let compiled: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.warn(`Failed to compile shader: ${ gl.getShaderInfoLog(shader) }`);
        gl.deleteShader(shader);
        
        result = maybe.nothing<WebGLShader>();
    } else {
        result = maybe.just(shader);
    }
    
    return result;
};

export let linkProgram = (gl: WebGLRenderingContext, shaders: WebGLShader[]) => {
    let result: maybe.Maybe<WebGLProgram>;
    
    let program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    
    let linked: boolean = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        console.warn(`Failed to link program: ${ gl.getProgramInfoLog(program) }`);
        gl.deleteProgram(program);
        
        result = maybe.nothing();
    } else {
        result = maybe.just(program);
    }
    
    return result;
};

export let bindBufferToAttribute = (gl: WebGLRenderingContext, buffer: WebGLBuffer, vertexSize: number, program: WebGLProgram, name: string) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    let attributePosition = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(attributePosition);
    gl.vertexAttribPointer(attributePosition, vertexSize, gl.FLOAT, false, 0, 0);
}