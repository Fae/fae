/* eslint max-params: [2, { max: 7 }] */

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
    constructor(sfactor, dfactor, equation)
    {
        this.sfactor = sfactor;
        this.dfactor = dfactor;
        this.equation = equation;
    }

    /**
     * @param {!WebGLRenderingContext} gl - The rendering context to set on.
     */
    enable(gl)
    {
        gl.blendFunc(this.sfactor, this.dfactor);
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
            && this.equation === mode.equation;
    }
}

// short name, I'm lazy.
const c = WebGLRenderingContext;

/* eslint-disable no-multi-spaces */
BlendMode.NORMAL       = new BlendMode(c.ONE, c.ONE_MINUS_SRC_ALPHA, c.FUNC_ADD);
BlendMode.ADD          = new BlendMode(c.ONE, c.DST_ALPHA, c.FUNC_ADD);
BlendMode.SUBTRACT     = new BlendMode(c.ONE, c.DST_ALPHA, c.FUNC_SUBTRACT);
BlendMode.MULTIPLY     = new BlendMode(c.DST_COLOR, c.ONE_MINUS_SRC_ALPHA, c.FUNC_ADD);
BlendMode.EXCLUSION    = new BlendMode(c.ONE_MINUS_DST_COLOR, c.ONE_MINUS_SRC_COLOR, c.FUNC_ADD);
/* eslint-enable no-multi-spaces */
