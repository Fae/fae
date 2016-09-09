import { Filter, FilterUtils } from '@fae/filters';
import BlurXFilter from './BlurXFilter';
import BlurYFilter from './BlurYFilter';

/**
 * @class
 */
export default class BlurFilter extends Filter
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     */
    constructor(renderer)
    {
        super(renderer);

        this.blurXFilter = new BlurXFilter(renderer);
        this.blurYFilter = new BlurYFilter(renderer);
    }

    /**
     * Runs the filter, performing the post-processing passes the filter defines.
     *
     * @param {FilterRenderSystem} system - The render system.
     * @param {RenderTarget} input - The render target to use as input.
     * @param {RenderTarget} output - The render target to use as output.
     * @param {boolean} clear - Should the output buffer be cleared before use?
     */
    run(system, input, output /* , clear */)
    {
        const renderTarget = FilterUtils.getRenderTarget(this.renderer.gl);

        this.blurXFilter.run(system, input, renderTarget, true);
        this.blurYFilter.run(system, renderTarget, output, false);

        FilterUtils.freeRenderTarget(renderTarget);
    }

    /**
     * Number of passes for the blur. Higher number produices a higher
     * quality blur, but is less performant.
     *
     * @member {number}
     * @default 1
     */
    get numPasses()
    {
        return this.blurXFilter.numPasses;
    }

    /**
     * Number of passes for the blur. Higher number produices a higher
     * quality blur, but is less performant.
     *
     * @param {number} v - The value to set to.
     */
    set numPasses(v)
    {
        this.blurXFilter.numPasses = v;
        this.blurYFilter.numPasses = v;
    }

    /**
     * Number of passes for the blur. Higher number produices a higher
     * quality blur, but is less performant.
     *
     * @member {number}
     * @default 1
     */
    get strength()
    {
        return this.blurXFilter.strength;
    }

    /**
     * Number of passes for the blur. Higher number produices a higher
     * quality blur, but is less performant.
     *
     * @param {number} v - The value to set to.
     */
    set strength(v)
    {
        this.blurXFilter.strength = v;
        this.blurYFilter.strength = v;
    }
}
