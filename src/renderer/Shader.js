import GLShader from '../gl/GLShader';
import { PRECISION } from '../config';

/**
 * Shader wrapper.
 *
 * @class
 */
export default class Shader extends GLShader
{
    /**
     * Constructs a new Shader.
     *
     * @param {!WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {!string} vertexSrc - The vertex shader source as an array of strings.
     * @param {!string} fragmentSrc - The fragment shader source as an array of strings.
     */
    constructor(gl, vertexSrc, fragmentSrc)
    {
        super(gl, checkPrecision(vertexSrc), checkPrecision(fragmentSrc));
    }
}

/**
 * Ensures that the source of the program has precision specified.
 *
 * @param {string} source - The source to check.
 * @return {string} The potentially modified source.
 */
function checkPrecision(source)
{
    if (source.substring(0, 9) !== 'precision')
    {
        return `precision ${PRECISION.DEFAULT} float;\n\n${source}`;
    }

    return source;
}
