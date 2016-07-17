import object = require('./object');
import array = require('./array');
import func = require('./func');

type ContextReader<T> = (gl: WebGLRenderingContext) => T;
type ShaderReader<T> = (shader: WebGLShader) => ContextReader<T>;
type ProgramReader<T> = (program: WebGLProgram) => ContextReader<T>;
interface StaticWebGLRenderingContext {
    // canvas: HTMLCanvasElement;
    // drawingBufferHeight: number;
    // drawingBufferWidth: number;
    activeTexture(texture: number): ContextReader<void>;
    attachShader(shader: WebGLShader): ProgramReader<WebGLProgram>;
    bindAttribLocation(program: WebGLProgram, index: number, name: string): ContextReader<void>;
    bindBuffer(target: number, buffer: WebGLBuffer): ContextReader<void>;
    bindFramebuffer(target: number, framebuffer: WebGLFramebuffer): ContextReader<void>;
    bindRenderbuffer(target: number, renderbuffer: WebGLRenderbuffer): ContextReader<void>;
    bindTexture(target: number, texture: WebGLTexture): ContextReader<void>;
    blendColor(red: number, green: number, blue: number, alpha: number): ContextReader<void>;
    blendEquation(mode: number): ContextReader<void>;
    blendEquationSeparate(modeRGB: number, modeAlpha: number): ContextReader<void>;
    blendFunc(sfactor: number, dfactor: number): ContextReader<void>;
    blendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number): ContextReader<void>;
    bufferData(target: number, size: number | ArrayBufferView | ArrayBuffer, usage: number): ContextReader<void>;
    bufferSubData(target: number, offset: number, data: ArrayBufferView | ArrayBuffer): ContextReader<void>;
    checkFramebufferStatus(target: number): ContextReader<number>;
    clear(mask: number): ContextReader<void>;
    clearColor(red: number, green: number, blue: number, alpha: number): ContextReader<void>;
    clearDepth(depth: number): ContextReader<void>;
    clearStencil(s: number): ContextReader<void>;
    colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): ContextReader<void>;
    compileShader: ShaderReader<WebGLShader>;
    compressedTexImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, data: ArrayBufferView): ContextReader<void>;
    compressedTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, data: ArrayBufferView): ContextReader<void>;
    copyTexImage2D(target: number, level: number, internalformat: number, x: number, y: number, width: number, height: number, border: number): ContextReader<void>;
    copyTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number): ContextReader<void>;
    createBuffer(): ContextReader<WebGLBuffer>;
    createFramebuffer(): ContextReader<WebGLFramebuffer>;
    createProgram(): ContextReader<WebGLProgram>;
    createRenderbuffer(): ContextReader<WebGLRenderbuffer>;
    createShader(type: number): ContextReader<WebGLShader>;
    createTexture(): ContextReader<WebGLTexture>;
    cullFace(mode: number): ContextReader<void>;
    deleteBuffer(buffer: WebGLBuffer): ContextReader<void>;
    deleteFramebuffer(framebuffer: WebGLFramebuffer): ContextReader<void>;
    deleteProgram(program: WebGLProgram): ContextReader<void>;
    deleteRenderbuffer(renderbuffer: WebGLRenderbuffer): ContextReader<void>;
    deleteShader: ShaderReader<void>;
    deleteTexture(texture: WebGLTexture): ContextReader<void>;
    depthFunc(func: number): ContextReader<void>;
    depthMask(flag: boolean): ContextReader<void>;
    depthRange(zNear: number, zFar: number): ContextReader<void>;
    detachShader(program: WebGLProgram, shader: WebGLShader): ContextReader<void>;
    disable(cap: number): ContextReader<void>;
    disableVertexAttribArray(index: number): ContextReader<void>;
    drawArrays(mode: number, first: number, count: number): ContextReader<void>;
    drawElements(mode: number, count: number, type: number, offset: number): ContextReader<void>;
    enable(cap: number): ContextReader<void>;
    enableVertexAttribArray(index: number): ContextReader<void>;
    finish(): ContextReader<void>;
    flush(): ContextReader<void>;
    framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: WebGLRenderbuffer): ContextReader<void>;
    framebufferTexture2D(target: number, attachment: number, textarget: number, texture: WebGLTexture, level: number): ContextReader<void>;
    frontFace(mode: number): ContextReader<void>;
    generateMipmap(target: number): ContextReader<void>;
    getActiveAttrib(program: WebGLProgram, index: number): ContextReader<WebGLActiveInfo>;
    getActiveUniform(program: WebGLProgram, index: number): ContextReader<WebGLActiveInfo>;
    getAttachedShaders(program: WebGLProgram): ContextReader<WebGLShader[]>;
    getAttribLocation(program: WebGLProgram, name: string): ContextReader<number>;
    getBufferParameter(target: number, pname: number): ContextReader<any>;
    getContextAttributes(): ContextReader<WebGLContextAttributes>;
    getError(): ContextReader<number>;
    getExtension(name: string): ContextReader<any>;
    getFramebufferAttachmentParameter(target: number, attachment: number, pname: number): ContextReader<any>;
    getParameter(pname: number): ContextReader<any>;
    getProgramInfoLog(program: WebGLProgram): ContextReader<string>;
    getProgramParameter(pname: number): ProgramReader<boolean>;
    getRenderbufferParameter(target: number, pname: number): ContextReader<any>;
    getShaderInfoLog(shader: WebGLShader): ContextReader<string>;
    getShaderParameter(pname: number): ShaderReader<boolean>;
    getShaderPrecisionFormat(shadertype: number, precisiontype: number): ContextReader<WebGLShaderPrecisionFormat>;
    getShaderSource(shader: WebGLShader): ContextReader<string>;
    getSupportedExtensions(): ContextReader<string[]>;
    getTexParameter(target: number, pname: number): ContextReader<any>;
    getUniform(program: WebGLProgram, location: WebGLUniformLocation): ContextReader<any>;
    getUniformLocation(program: WebGLProgram, name: string): ContextReader<WebGLUniformLocation>;
    getVertexAttrib(index: number, pname: number): ContextReader<any>;
    getVertexAttribOffset(index: number, pname: number): ContextReader<number>;
    hint(target: number, mode: number): ContextReader<void>;
    isBuffer(buffer: WebGLBuffer): ContextReader<boolean>;
    isContextLost(): ContextReader<boolean>;
    isEnabled(cap: number): ContextReader<boolean>;
    isFramebuffer(framebuffer: WebGLFramebuffer): ContextReader<boolean>;
    isProgram(program: WebGLProgram): ContextReader<boolean>;
    isRenderbuffer(renderbuffer: WebGLRenderbuffer): ContextReader<boolean>;
    isShader(shader: WebGLShader): ContextReader<boolean>;
    isTexture(texture: WebGLTexture): ContextReader<boolean>;
    lineWidth(width: number): ContextReader<void>;
    linkProgram: ProgramReader<WebGLProgram>;
    pixelStorei(pname: number, param: number): ContextReader<void>;
    polygonOffset(factor: number, units: number): ContextReader<void>;
    readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): ContextReader<void>;
    renderbufferStorage(target: number, internalformat: number, width: number, height: number): ContextReader<void>;
    sampleCoverage(value: number, invert: boolean): ContextReader<void>;
    scissor(x: number, y: number, width: number, height: number): ContextReader<void>;
    shaderSource(source: string): ShaderReader<WebGLShader>;
    stencilFunc(func: number, ref: number, mask: number): ContextReader<void>;
    stencilFuncSeparate(face: number, func: number, ref: number, mask: number): ContextReader<void>;
    stencilMask(mask: number): ContextReader<void>;
    stencilMaskSeparate(face: number, mask: number): ContextReader<void>;
    stencilOp(fail: number, zfail: number, zpass: number): ContextReader<void>;
    stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): ContextReader<void>;
    texImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels: ArrayBufferView): ContextReader<void>;
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, image: HTMLImageElement): ContextReader<void>;
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, canvas: HTMLCanvasElement): ContextReader<void>;
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, video: HTMLVideoElement): ContextReader<void>;
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: ImageData): ContextReader<void>;
    texParameterf(target: number, pname: number, param: number): ContextReader<void>;
    texParameteri(target: number, pname: number, param: number): ContextReader<void>;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): ContextReader<void>;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, image: HTMLImageElement): ContextReader<void>;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, canvas: HTMLCanvasElement): ContextReader<void>;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, video: HTMLVideoElement): ContextReader<void>;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, pixels: ImageData): ContextReader<void>;
    uniform1f(location: WebGLUniformLocation, x: number): ContextReader<void>;
    uniform1fv(location: WebGLUniformLocation, v: Float32Array): ContextReader<void>;
    uniform1i(location: WebGLUniformLocation, x: number): ContextReader<void>;
    uniform1iv(location: WebGLUniformLocation, v: Int32Array): ContextReader<void>;
    uniform2f(location: WebGLUniformLocation, x: number, y: number): ContextReader<void>;
    uniform2fv(location: WebGLUniformLocation, v: Float32Array): ContextReader<void>;
    uniform2i(location: WebGLUniformLocation, x: number, y: number): ContextReader<void>;
    uniform2iv(location: WebGLUniformLocation, v: Int32Array): ContextReader<void>;
    uniform3f(location: WebGLUniformLocation, x: number, y: number, z: number): ContextReader<void>;
    uniform3fv(location: WebGLUniformLocation, v: Float32Array): ContextReader<void>;
    uniform3i(location: WebGLUniformLocation, x: number, y: number, z: number): ContextReader<void>;
    uniform3iv(location: WebGLUniformLocation, v: Int32Array): ContextReader<void>;
    uniform4f(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): ContextReader<void>;
    uniform4fv(location: WebGLUniformLocation, v: Float32Array): ContextReader<void>;
    uniform4i(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): ContextReader<void>;
    uniform4iv(location: WebGLUniformLocation, v: Int32Array): ContextReader<void>;
    uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array): ContextReader<void>;
    uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array): ContextReader<void>;
    uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array): ContextReader<void>;
    useProgram(program: WebGLProgram): ContextReader<void>;
    validateProgram(program: WebGLProgram): ContextReader<void>;
    vertexAttrib1f(indx: number, x: number): ContextReader<void>;
    vertexAttrib1fv(indx: number, values: Float32Array): ContextReader<void>;
    vertexAttrib2f(indx: number, x: number, y: number): ContextReader<void>;
    vertexAttrib2fv(indx: number, values: Float32Array): ContextReader<void>;
    vertexAttrib3f(indx: number, x: number, y: number, z: number): ContextReader<void>;
    vertexAttrib3fv(indx: number, values: Float32Array): ContextReader<void>;
    vertexAttrib4f(indx: number, x: number, y: number, z: number, w: number): ContextReader<void>;
    vertexAttrib4fv(indx: number, values: Float32Array): ContextReader<void>;
    vertexAttribPointer(indx: number, size: number, type: number, normalized: boolean, stride: number, offset: number): ContextReader<void>;
    viewport(x: number, y: number, width: number, height: number): ContextReader<void>;
}

const webgl: StaticWebGLRenderingContext = ((obj: StaticWebGLRenderingContext & { [key: string]: any }) => {

    const keysNotToWrap = object.keys(WebGLRenderingContext).concat([
        "attachShader",
        "getProgramParameter",
        "linkProgram",

        "compileShader",
        "getShaderParameter",
        "shaderSource"
    ]);
    const keysToWrap = array.except(object.keys(WebGLRenderingContext.prototype), keysNotToWrap); 

    keysToWrap
        .map(key => ({ key, value: func.fromObjectProperty(key, WebGLRenderingContext.prototype) }))
        .filter(keyValue => keyValue.value.hasValue)
        .map(keyValue => ({ key: keyValue.key, value: keyValue.value.value }))
        .map(keyValue => (<{ key: string, value: (...args: any[]) => (context: any) => any }>{ key: keyValue.key, value: (...args: any[]) => (context: any) => keyValue.value(context, ...args) }))
        .forEach(keyValue => obj[keyValue.key] = keyValue.value);
    
    obj.attachShader = (shader) => (program) => (gl) => { gl.attachShader(program, shader); return program; };
    obj.getProgramParameter = (pname) => (program) => (gl) => gl.getProgramParameter(program, pname);
    obj.linkProgram = (program) => (gl) => { gl.linkProgram(program); return program; };

    obj.compileShader = (shader) => (gl) => { gl.compileShader(shader); return shader; };
    obj.getShaderParameter = (pname) => (shader) => (gl) => gl.getShaderParameter(shader, pname);
    obj.shaderSource = (source) => (shader) => (gl) => { gl.shaderSource(shader, source); return shader; };

    return obj;
})(<StaticWebGLRenderingContext>{});
console.log(webgl);

export = webgl;