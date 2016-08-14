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
 * @return {number} The nexst unique id.
 */
export function uid()
{
    return nextUid++;
}

/**
 * Fast replacement for splice that quickly removes elements from an array.
 *
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

/**
 * Utility to quickly create the indicies for a series of quads.
 *
 * @param {number} size - Number of quads
 * @return {Uint16Array} indices
 */
export function createIndicesForQuads(size)
{
    // the total number of indices in our array, there are 6 points per quad.
    const totalIndices = size * 6;
    const indices = new Uint16Array(totalIndices);

    // fill the indices with the quads to draw
    for (let i = 0, j = 0; i < totalIndices; i += 6, j += 4)
    {
        indices[i + 0] = j + 0;
        indices[i + 1] = j + 1;
        indices[i + 2] = j + 2;
        indices[i + 3] = j + 0;
        indices[i + 4] = j + 2;
        indices[i + 5] = j + 3;
    }

    return indices;
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

function testMaxIf(shader, gl, max)
{
    const fragmentSrc = ifCheckShaderTemplate.replace(/\{\{if_statements\}\}/gi, generateIfTestSrc(max));

    gl.shaderSource(shader, fragmentSrc);
    gl.compileShader(shader);

    return gl.getShaderParameter(shader, gl.COMPILE_STATUS);
}

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
