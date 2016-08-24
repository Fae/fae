let PROGRAM_CACHE = {};

export default {
    get(key)
    {
        return PROGRAM_CACHE[key];
    },
    set(key, program)
    {
        PROGRAM_CACHE[key] = program;
    },
    key(vsrc, fsrc)
    {
        return vsrc + fsrc;
    },
    clear()
    {
        PROGRAM_CACHE = {};
    },
};
