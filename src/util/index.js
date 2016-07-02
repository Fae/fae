// @ifdef DEBUG
import { ASSERT } from './debug';
// @endif

let nextUid = 0;

// reexport color
export { default as Color } from './Color';

/**
 * Logs an error to the console.
 *
 * @param {...*} things to pass into `console.error`.
 */
export function error(...args)
{
    args[0] = `[Fay Error] ${args[0]}`;

    console.error(...args); // eslint-disable-line no-console
}

/**
 * Logs a message to the console.
 *
 * @param {...*} things to pass into `console.log`.
 */
export function log(...args)
{
    args[0] = `[Fay] ${args[0]}`;

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
 * @param {*[]} array - The array to manipulate.
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
