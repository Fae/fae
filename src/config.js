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
 * The scale modes that are supported by pixi.
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
