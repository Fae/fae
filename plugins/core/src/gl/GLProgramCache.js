let PROGRAM_CACHE = {};

/**
 * @namespace GLProgramCache
 * @memberof glutil
 */
export default {
    /**
     * Gets a program from the cache.
     *
     * @memberof glutil.GLProgramCache
     * @param {string} key - The key of the program to get.
     * @return {WebGLProgram} The cached program, or undefined if none found.
     */
    get(key)
    {
        return PROGRAM_CACHE[key];
    },

    /**
     * Sets a program in the cache.
     *
     * @memberof glutil.GLProgramCache
     * @param {string} key - The key of the program to get.
     * @param {WebGLProgram} program - The program to put into the cache.
     */
    set(key, program)
    {
        PROGRAM_CACHE[key] = program;
    },

    /**
     * Generates a cache key for a vertex/fragment source pair.
     *
     * @memberof glutil.GLProgramCache
     * @param {string} vsrc - The vertex source of the program that will be stored.
     * @param {string} fsrc - The fragment source of the program that will be stored.
     * @return {string} The cache key.
     */
    key(vsrc, fsrc)
    {
        return vsrc + fsrc;
    },

    /**
     * Clears the GLProgramCache storage.
     *
     * @memberof glutil.GLProgramCache
     */
    clear()
    {
        PROGRAM_CACHE = {};
    },
};
