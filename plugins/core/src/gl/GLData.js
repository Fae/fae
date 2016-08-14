// @ifdef DEBUG
import { ASSERT } from '../debug';
// @endif

/**
 * Map of WebGL types to their respective sizes.
 */
export const GL_SIZE_MAP = {
    [WebGLRenderingContext.FLOAT]:      1,
    [WebGLRenderingContext.FLOAT_VEC2]: 2,
    [WebGLRenderingContext.FLOAT_VEC3]: 3,
    [WebGLRenderingContext.FLOAT_VEC4]: 4,

    [WebGLRenderingContext.INT]:        1,
    [WebGLRenderingContext.INT_VEC2]:   2,
    [WebGLRenderingContext.INT_VEC3]:   3,
    [WebGLRenderingContext.INT_VEC4]:   4,

    [WebGLRenderingContext.BOOL]:       1,
    [WebGLRenderingContext.BOOL_VEC2]:  2,
    [WebGLRenderingContext.BOOL_VEC3]:  3,
    [WebGLRenderingContext.BOOL_VEC4]:  4,

    [WebGLRenderingContext.FLOAT_MAT2]: 4,
    [WebGLRenderingContext.FLOAT_MAT3]: 9,
    [WebGLRenderingContext.FLOAT_MAT4]: 16,

    [WebGLRenderingContext.SAMPLER_2D]: 1,
};

/**
 * Map of WebGL types to setter functions to upload the values of that type.
 * This map is for single values of the types.
 */
export const GL_SETTER = {
    [WebGLRenderingContext.FLOAT]:      (gl, loc, value) => gl.uniform1f(loc, value),
    [WebGLRenderingContext.FLOAT_VEC2]: (gl, loc, value) => gl.uniform2f(loc, value[0], value[1]),
    [WebGLRenderingContext.FLOAT_VEC3]: (gl, loc, value) => gl.uniform3f(loc, value[0], value[1], value[2]),
    [WebGLRenderingContext.FLOAT_VEC4]: (gl, loc, value) => gl.uniform4f(loc, value[0], value[1], value[2], value[3]),

    [WebGLRenderingContext.INT]:        (gl, loc, value) => gl.uniform1i(loc, value),
    [WebGLRenderingContext.INT_VEC2]:   (gl, loc, value) => gl.uniform2i(loc, value[0], value[1]),
    [WebGLRenderingContext.INT_VEC3]:   (gl, loc, value) => gl.uniform3i(loc, value[0], value[1], value[2]),
    [WebGLRenderingContext.INT_VEC4]:   (gl, loc, value) => gl.uniform4i(loc, value[0], value[1], value[2], value[3]),

    [WebGLRenderingContext.BOOL]:       (gl, loc, value) => gl.uniform1i(loc, value),
    [WebGLRenderingContext.BOOL_VEC2]:  (gl, loc, value) => gl.uniform2i(loc, value[0], value[1]),
    [WebGLRenderingContext.BOOL_VEC3]:  (gl, loc, value) => gl.uniform3i(loc, value[0], value[1], value[2]),
    [WebGLRenderingContext.BOOL_VEC4]:  (gl, loc, value) => gl.uniform4i(loc, value[0], value[1], value[2], value[3]),

    [WebGLRenderingContext.FLOAT_MAT2]: (gl, loc, value) => gl.uniformMatrix2fv(loc, false, value),
    [WebGLRenderingContext.FLOAT_MAT3]: (gl, loc, value) => gl.uniformMatrix3fv(loc, false, value),
    [WebGLRenderingContext.FLOAT_MAT4]: (gl, loc, value) => gl.uniformMatrix4fv(loc, false, value),

    [WebGLRenderingContext.SAMPLER_2D]: (gl, loc, value) => gl.uniform1i(loc, value),
};

/**
 * Map of WebGL types to setter functions to upload the values of that type.
 * This map is for arrays of the types.
 */
export const GL_ARRAY_SETTER = {
    [WebGLRenderingContext.FLOAT]:      (gl, loc, value) => gl.uniform1fv(loc, value),
    [WebGLRenderingContext.FLOAT_VEC2]: (gl, loc, value) => gl.uniform2fv(loc, value[0], value[1]),
    [WebGLRenderingContext.FLOAT_VEC3]: (gl, loc, value) => gl.uniform3fv(loc, value[0], value[1], value[2]),
    [WebGLRenderingContext.FLOAT_VEC4]: (gl, loc, value) => gl.uniform4fv(loc, value[0], value[1], value[2], value[3]),

    [WebGLRenderingContext.INT]:        (gl, loc, value) => gl.uniform1iv(loc, value),
    [WebGLRenderingContext.INT_VEC2]:   (gl, loc, value) => gl.uniform2iv(loc, value[0], value[1]),
    [WebGLRenderingContext.INT_VEC3]:   (gl, loc, value) => gl.uniform3iv(loc, value[0], value[1], value[2]),
    [WebGLRenderingContext.INT_VEC4]:   (gl, loc, value) => gl.uniform4iv(loc, value[0], value[1], value[2], value[3]),

    [WebGLRenderingContext.BOOL]:       (gl, loc, value) => gl.uniform1iv(loc, value),
    [WebGLRenderingContext.BOOL_VEC2]:  (gl, loc, value) => gl.uniform2iv(loc, value[0], value[1]),
    [WebGLRenderingContext.BOOL_VEC3]:  (gl, loc, value) => gl.uniform3iv(loc, value[0], value[1], value[2]),
    [WebGLRenderingContext.BOOL_VEC4]:  (gl, loc, value) => gl.uniform4iv(loc, value[0], value[1], value[2], value[3]),

    [WebGLRenderingContext.FLOAT_MAT2]: (gl, loc, value) => gl.uniformMatrix2fv(loc, false, value),
    [WebGLRenderingContext.FLOAT_MAT3]: (gl, loc, value) => gl.uniformMatrix3fv(loc, false, value),
    [WebGLRenderingContext.FLOAT_MAT4]: (gl, loc, value) => gl.uniformMatrix4fv(loc, false, value),

    [WebGLRenderingContext.SAMPLER_2D]: (gl, loc, value) => gl.uniform1iv(loc, value),
};

/**
 * Maps a uniform data type and size to an instance of the default value.
 *
 * @param {object} uniformData - The data to use to determine the default value.
 * @return {*} The default value.
 */
export function getUniformDefault(uniformData)
{
    const size = uniformData.size;

    switch (uniformData.type)
    {
        case WebGLRenderingContext.FLOAT:
            return 0;

        case WebGLRenderingContext.FLOAT_VEC2:
            return new Float32Array(2 * size);

        case WebGLRenderingContext.FLOAT_VEC3:
            return new Float32Array(3 * size);

        case WebGLRenderingContext.FLOAT_VEC4:
            return new Float32Array(4 * size);

        case WebGLRenderingContext.INT:
        case WebGLRenderingContext.SAMPLER_2D:
            return 0;

        case WebGLRenderingContext.INT_VEC2:
            return new Int32Array(2 * size);

        case WebGLRenderingContext.INT_VEC3:
            return new Int32Array(3 * size);

        case WebGLRenderingContext.INT_VEC4:
            return new Int32Array(4 * size);

        case WebGLRenderingContext.BOOL:
            return false;

        case WebGLRenderingContext.BOOL_VEC2:
            return booleanArray(2 * size);

        case WebGLRenderingContext.BOOL_VEC3:
            return booleanArray(3 * size);

        case WebGLRenderingContext.BOOL_VEC4:
            return booleanArray(4 * size);

        case WebGLRenderingContext.FLOAT_MAT2:
            return new Float32Array([1, 0,
                                     0, 1]);

        case WebGLRenderingContext.FLOAT_MAT3:
            return new Float32Array([1, 0, 0,
                                     0, 1, 0,
                                     0, 0, 1]);

        case WebGLRenderingContext.FLOAT_MAT4:
            return new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     0, 0, 0, 1]);
    }

    // @ifdef DEBUG
    ASSERT(false, 'Unknown uniform type, unable to determine default value.');
    // @endif

    return 0;
}

function booleanArray(size)
{
    const array = new Array(size);

    for (let i = 0; i < array.length; ++i)
    {
        array[i] = false;
    }

    return array;
}
