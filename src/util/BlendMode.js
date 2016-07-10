/* eslint max-params: [2, { max: 7 }] */

import { BLEND_MODES } from '../config';

/**
 * @class
 */
export default class BlendMode
{
    /**
     * @param {number} sfactor - The source factor (for glBlendFunc).
     * @param {number} dfactor - The destination factor (for glBlendFunc).
     * @param {number} equation - The Alpha blend function to use (for glBlendEquation).
     * @param {number} id - The preset blend mode this object represents.
     */
    constructor(sfactor, dfactor, equation, id = BLEND_MODES.CUSTOM)
    {
        this.id = id;

        this.sfactor = sfactor;
        this.dfactor = dfactor;
        this.equation = equation;
    }

    /**
     * @param {!WebGLRenderingContext} gl - The rendering context to set on.
     */
    enable(gl)
    {
        gl.blendFunc(this.srcRgb, this.dstRgb, this.srcAlpha, this.dstAlpha);
        gl.blendEquation(this.equation);
    }

    /**
     * Checks for equality with another blend mode.
     *
     * @param {BlendMode} mode - The mode to check equality against.
     * @return {boolean} True if they are equal.
     */
    equals(mode)
    {
        return !!mode
            && this.sfactor === mode.sfactor
            && this.dfactor === mode.dfactor
            && this.mode === mode.equation;
    }
}

// pixi:
// color(RGBA) = (sourceColor * sfactor) + (destinationColor * dfactor)

// separate:
// color(RGB) = (sourceColor * srcRGB) + (destinationColor * dstRGB)
// color(A) = (sourceAlpha * srcAlpha) + (destinationAlpha * dstAlpha)

// short names, I'm lazy.
const c = WebGLRenderingContext;
const B = BLEND_MODES;
const BM = BlendMode;

BM.MODES = [];

/* eslint-disable no-multi-spaces, max-len */
BM.NORMAL       = BM.MODES[B.NORMAL]    = new BM(c.ONE, c.ONE_MINUS_SRC_ALPHA, c.FUNC_ADD, B.NORMAL);
BM.ADD          = BM.MODES[B.ADD]       = new BM(c.ONE, c.DST_ALPHA, c.FUNC_ADD, B.ADD);
BM.SUBTRACT     = BM.MODES[B.SUBTRACT]  = new BM(c.ONE, c.DST_ALPHA, c.FUNC_SUBTRACT, B.SUBTRACT);
BM.MULTIPLY     = BM.MODES[B.MULTIPLY]  = new BM(c.DST_COLOR, c.ONE_MINUS_SRC_ALPHA, c.FUNC_SUBTRACT, B.SUBTRACT);
BM.EXCLUSION    = BM.MODES[B.EXCLUSION] = new BM(c.ONE_MINUS_DST_COLOR, c.ONE_MINUS_SRC_COLOR, c.FUNC_SUBTRACT, B.EXCLUSION);
/* eslint-enable no-multi-spaces, max-len */
