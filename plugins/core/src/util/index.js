/** @namespace util */

import GLContext from '../gl/GLContext';

// @ifdef DEBUG
import { ASSERT } from '../debug';
// @endif

let nextUid = 0;

// reexport some utils
export { default as Color } from './Color';
export { default as Buffer } from './Buffer';
export { default as BlendMode } from './BlendMode';
export { default as Flags } from './Flags';

/**
 * Logs an error to the console.
 *
 * @memberof util
 * @param {...*} things to pass into `console.error`.
 */
export function error(...args)
{
    args[0] = `[Fae Error] ${args[0]}`;

    console.error(...args); // eslint-disable-line no-console
}

/**
 * Logs a message to the console.
 *
 * @memberof util
 * @param {...*} things to pass into `console.log`.
 */
export function log(...args)
{
    args[0] = `[Fae] ${args[0]}`;

    console.log(...args); // eslint-disable-line no-console
}

/**
 * Gets the next unique id.
 *
 * @memberof util
 * @return {number} The nexst unique id.
 */
export function uid()
{
    return nextUid++;
}

/**
 * Fast replacement for splice that quickly removes elements from an array.
 *
 * @memberof util
 * @param {Array<*>} array - The array to manipulate.
 * @param {number} startIdx - The starting index.
 * @param {number} removeCount - The number of elements to remove.
 */
export function removeElements(array, startIdx = 0, removeCount = 1)
{
    const length = array.length;

    // @ifdef DEBUG
    ASSERT(startIdx < length, 'removeElements: index out of range.');
    ASSERT(removeCount !== 0, 'removeElements: remove count must be non-zero.');
    // @endif

    removeCount = startIdx + removeCount > length ? (length - startIdx) : removeCount;
    const newLength = length - removeCount;

    for (let i = startIdx; i < newLength; ++i)
    {
        array[i] = array[i + removeCount];
    }

    array.length = newLength;
}

const ifCheckShaderTemplate = `
precision mediump float;
void main(void)
{
    float test = 0.1;
    {{if_statements}}
    gl_FragColor = vec4(0.0);
}
`;

/**
 * Calculate the max number of if statements supported in a shader, up to
 * a maximum cap.
 *
 * @memberof util
 * @param {WebGLRenderingContext} gl - The rendering context
 * @param {number} maxIfs - cap for the if checks.
 * @return {number} The max ifs supported
 */
export function getMaxIfStatmentsInShader(gl, maxIfs)
{
    const createTempContext = !gl;

    if (createTempContext)
    {
        const tinyCanvas = document.createElement('canvas');

        tinyCanvas.width = 1;
        tinyCanvas.height = 1;

        gl = GLContext.create(tinyCanvas);
    }

    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    let max = typeof maxIfs === 'number' ? maxIfs : 50;
    let guess = max;

    // binary search for max ifs, optimistically.
    // - assumes higher will work most of the time.
    // - best case is even numbers, which this should be most of the time.
    while (guess)
    {
        const result = testMaxIf(shader, gl, guess);

        // failed, lower expectations.
        if (!result)
        {
            max = guess;
            guess = max >> 1;
        }
        // succeeded, raise expectations.
        else
        {
            if (max - guess <= 1) break;

            guess += (max - guess) >> 1;
        }
    }

    if (createTempContext)
    {
        // get rid of context
        if (gl.getExtension('WEBGL_lose_context'))
        {
            gl.getExtension('WEBGL_lose_context').loseContext();
        }
    }

    return guess;
}

/**
 * Builds and tried to compile a shader with the specified number of if-statements.
 *
 * @ignore
 * @param {WebGLShader} shader - The shader program to use.
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @param {number} max - Number of ifs to generate.
 * @return {number} The compilation status.
 */
function testMaxIf(shader, gl, max)
{
    const fragmentSrc = ifCheckShaderTemplate.replace(/\{\{if_statements\}\}/gi, generateIfTestSrc(max));

    gl.shaderSource(shader, fragmentSrc);
    gl.compileShader(shader);

    return gl.getShaderParameter(shader, gl.COMPILE_STATUS);
}

/**
 * Generates a shader source with the specified number of if-statements.
 *
 * @ignore
 * @param {number} max - Number of ifs to generate.
 * @return {string} The shader source.
 */
function generateIfTestSrc(max)
{
    let src = '';

    for (let i = 0; i < max; ++i)
    {
        if (i > 0)
        {
            src += '\nelse ';
        }

        if (i < max - 1)
        {
            src += `if(test == ${i}.0) {}`;
        }
    }

    return src;
}
