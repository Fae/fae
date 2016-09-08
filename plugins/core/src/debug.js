// @ifdef DEBUG
/**
 * Note that the debug namespace is only exported in "debug" builds.
 * In production builds, this namespace is not included.
 *
 * @namespace debug
 */

/**
 * @memberof debug
 * @param {boolean} bool - The condition to ensure is true.
 * @param {string} message - The message to display if the first param is not true.
 */
export function ASSERT(bool, message)
{
    if (!bool) throw new Error(`[Fae ASSERT] ${message}`);
}
// @endif
