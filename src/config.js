/**
 * Value that specifies float precision in shaders.
 *
 * @static
 * @constant
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
 */
export const SCALE_MODES = {
    DEFAULT:    WebGLRenderingContext.LINEAR,
    NEAREST:    WebGLRenderingContext.NEAREST,
    LINEAR:     WebGLRenderingContext.LINEAR,
};

/**
 * The blend modes that are supported by fay.
 *
 * The DEFAULT scale mode affects the default scaling mode of future operations.
 * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
 *
 * @static
 * @constant
 */
export const BLEND_MODES = {
    CUSTOM:         -1,
    DEFAULT:        0,
    NORMAL:         0,
    ADD:            1,
    SUBTRACT:       2,
    MULTIPLY:       3,
    EXCLUSION:      4,
};

/**
 * Type identifiers for classes in Fay.
 *
 * @static
 * @constant
 */
export const TYPE = {
    NONE: 0,
    SHAPE_POLYGON: 1,
    SHAPE_RECTANGLE: 2,
};
