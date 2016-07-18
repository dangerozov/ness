import monads = require('../monads');
import maybe = require('../monads/maybe');
import reader = require('../monads/reader');
import either = require('../monads/either');
import webgl = require('../webgl');

let readerEitherMap = <T, U, V, W>(rdr: monads.Reader<T, monads.Either<U, V>>, map: (value: V) => W): monads.Reader<T, monads.Either<U, W>> =>
    (args: T) => {
        let eitherValue = rdr(args);
        return eitherValue.hasRight
            ? either.right<U, W>(map(eitherValue.right))
            : either.left<U, W>(eitherValue.left);
    };

let readerEitherBind = <T, U, V, W>(rdr: monads.Reader<T, monads.Either<U, V>>, bind: (value: V) => monads.Reader<T, monads.Either<U, W>>): monads.Reader<T, monads.Either<U, W>> =>
    (args: T) => {
        let eitherValue = rdr(args);
        return eitherValue.hasRight
            ? bind(eitherValue.right)(args)
            : either.left<U, W>(eitherValue.left);
    };

export let compileProgram = (vertexSource: string, fragmentSource: string) =>
    readerEitherBind(compileShader(vertexSource, WebGLRenderingContext.VERTEX_SHADER),
        vertex => readerEitherBind(compileShader(fragmentSource, WebGLRenderingContext.FRAGMENT_SHADER),
            fragment => readerEitherBind(linkProgram(vertex, fragment),
                program => (gl) => {
                    webgl.deleteShader(vertex)(gl),
                    webgl.deleteShader(fragment)(gl);
                    return either.right(program);
                })));

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