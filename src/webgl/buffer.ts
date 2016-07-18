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