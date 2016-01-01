export default class Consts {}

Consts.VERSION = '{{version}}';

Consts.BLACK = [0, 0, 0, 255];

// provide easy access to the GL draw types
Consts.DRAW_TYPE = {
    POINTS:         WebGLRenderingContext.POINTS,
    LINES:          WebGLRenderingContext.LINES,
    TRIANGLES:      WebGLRenderingContext.TRIANGLES,
    TRIANGLE_STRIP: WebGLRenderingContext.TRIANGLE_STRIP,
    TRIANGLE_FAN:   WebGLRenderingContext.TRIANGLE_FAN
};
Object.freeze(Consts.DRAW_TYPE);

// component size of the elements in the vertex array
Consts.COMPONENT_SIZE = {
    POSITION_2D:    2,
    POSITION_3D:    3,
    COLOR:          1,
    TEX_COORDS:     2,
    NORMAL:         3
};
Object.freeze(Consts.COMPONENT_SIZE);

Consts.ASSERT = function (bool, message)
{
    if (!bool) throw new Error(message);
};
