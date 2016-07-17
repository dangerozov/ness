import maybe = require('./monads/maybe');
import webgl = require('./webgl');
import reader = require('./monads/reader');
import either = require('./monads/either');
import monads = require('./monads');

let readerEitherBind = <T, U, V, W>(rdr: monads.Reader<T, monads.Either<U, V>>, bind: (value: V) => monads.Reader<T, monads.Either<U, W>>) =>
    (args: T) => {
        let eitherValue = rdr(args);
        return eitherValue.hasRight
            ? bind(eitherValue.right)(args)
            : either.left<U, W>(eitherValue.left);
    };

export let compileProgram = (vertexSource: string, fragmentSource: string) =>
    readerEitherBind(compileShader(vertexSource, WebGLRenderingContext.VERTEX_SHADER),
        vertex => readerEitherBind(compileShader(fragmentSource, WebGLRenderingContext.FRAGMENT_SHADER),
            fragment => linkProgram(vertex, fragment)));

export let compileShader = (source: string, type: number) => reader.bind(reader.bind(reader.bind(
    webgl.createShader(type),
    webgl.shaderSource(source)),
    webgl.compileShader),
    shader => gl => {
        let compiled = webgl.getShaderParameter(WebGLRenderingContext.COMPILE_STATUS)(shader)(gl);
        
        let result = compiled
            ? either.right<string, WebGLShader>(shader)
            : either.left<string, WebGLShader>(
                `Failed to compile shader type ${type}:\nInfoLog: ${webgl.getShaderInfoLog(shader)(gl)}`);

        if (!compiled) webgl.deleteShader(shader)(gl);

        return result;
    });

export let linkProgram = (vertex: WebGLShader, fragment: WebGLShader) => reader.bind(reader.bind(reader.bind(reader.bind(
    webgl.createProgram(),
    webgl.attachShader(vertex)),
    webgl.attachShader(fragment)),
    webgl.linkProgram),
    program => gl => {
        let linked = webgl.getProgramParameter(WebGLRenderingContext.LINK_STATUS)(program)(gl);

        let result = linked
            ? either.right<string, WebGLProgram>(program)
            : either.left<string, WebGLProgram>(
                `Failed to link program:
                ValidateStatus: ${webgl.getProgramParameter(WebGLRenderingContext.VALIDATE_STATUS)}
                InfoLog: ${webgl.getProgramInfoLog(program)(gl)}`);

        if (!linked) webgl.deleteProgram(program)(gl);

        return result;
    });

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