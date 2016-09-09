import { Filter, FilterUtils } from '@fae/filters';
import { GAUSSIAN_VALUES, getFragSource, getVertSource, getMaxKernelSize } from './blurUtil';

/**
 * @class
 */
export default class BlurXFilter extends Filter
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     */
    constructor(renderer)
    {
        const kernelSize = getMaxKernelSize(renderer.gl);

        super(renderer, getFragSource(kernelSize), getVertSource(kernelSize, true));

        // set default values
        this.values.uBlurValues = GAUSSIAN_VALUES[kernelSize];

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
        this.values.uStrength = (1 / output.size.x) * (output.size.x / input.size.y);
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
