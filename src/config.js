/**
 * Value that specifies float precision in shaders.
 *
 * @static
 * @constant
 * @enum
 */
export const PRECISION = {
    DEFAULT:    'mediump',
    LOW:        'lowp',
    MEDIUM:     'mediump',
    HIGH:       'highp',
};

/**
 * The scale modes that are supported by fay.
 *
 * The DEFAULT scale mode affects the default scaling mode of future operations.
 * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
 *
 * @static
 * @constant
 * @enum
 */
export const SCALE_MODE = {
    DEFAULT:    WebGLRenderingContext.LINEAR,
    NEAREST:    WebGLRenderingContext.NEAREST,
    LINEAR:     WebGLRenderingContext.LINEAR,
};
