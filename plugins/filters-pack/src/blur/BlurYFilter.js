import { Filter, FilterUtils } from '@fae/filters';
import { GAUSSIAN_VALUES, getFragSource, getVertSource } from './blurUtil';

// @ifdef DEBUG
import { debug } from '@fae/core';
// @endif

/**
 * @class
 */
export default class BlurYFilter extends Filter
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} tapLevel - The guasian tap level to use. 5, 7, 9, 11, 13, or 15.
     */
    constructor(renderer, tapLevel = 5)
    {
        // @ifdef DEBUG
        debug.ASSERT(GAUSSIAN_VALUES[tapLevel],
            `Unknown tap level: ${tapLevel}, looking for one of: ${Object.keys(GAUSSIAN_VALUES)}`);
        // @endif

        super(renderer, getFragSource(tapLevel), getVertSource(tapLevel, false));

        // set default values
        this.values.uBlurValues = GAUSSIAN_VALUES[tapLevel];

        /**
         * Number of passes for the blur. Higher number produices a higher
         * quality blur, but is less performant.
         *
         * @member {number}
         * @default 1
         */
        this.numPasses = 1;

        /**
         * The strength of the blur.
         *
         * @member {number}
         * @default 1
         */
        this.strength = 1;
    }

    /**
     * Runs the filter, performing the post-processing passes the filter defines.
     *
     * @param {FilterRenderSystem} system - The render system.
     * @param {RenderTarget} input - The render target to use as input.
     * @param {RenderTarget} output - The render target to use as output.
     * @param {boolean} clear - Should the output buffer be cleared before use?
     */
    run(system, input, output, clear)
    {
        this.values.uStrength = (1 / output.size.y) * (output.size.y / input.size.y);
        this.values.uStrength *= Math.abs(this.strength);
        this.values.uStrength /= this.numPasses;

        if (this.numPasses === 1)
        {
            system.drawFilter(this, input, output, clear);
        }
        else
        {
            const renderTarget = FilterUtils.getRenderTarget(this.renderer.gl);
            let flip = input;
            let flop = renderTarget;

            for (let i = 0; i < this.numPasses - 1; ++i)
            {
                system.drawFilter(this, flip, flop, true);

                const t = flip;

                flip = flop;
                flop = t;
            }

            system.drawFilter(this, flip, output, clear);
            FilterUtils.freeRenderTarget(renderTarget);
        }
    }
}
