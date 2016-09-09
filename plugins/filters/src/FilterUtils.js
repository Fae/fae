import { render } from '@fae/core';
import { Rectangle } from '@fae/shapes';
import bitTwiddle from 'bit-twiddle';

/**
 * @namespace FilterUtils
 * @memberof filters
 */
export default {
    initialRenderTarget: null,
    activeRenderTarget: null,
    activeBounds: new Rectangle(),
    activeSize: new Rectangle(),
    _renderTargetPool: [],

    /**
     * Sets up the render targets and bounds for a filter render pass.
     * This is called by the FilterPrepareSystem when we encounter an
     * entity that has filters.
     *
     * @memberof filters.FilterUtils
     * @param {Entity} entity - The entity to setup for.
     * @param {Renderer} renderer - The renderer to setup for.
     */
    setup(entity, renderer /* , resolution*/)
    {
        this.initialRenderTarget = renderer.state.target;

        if (this.activeRenderTarget)
        {
            this.freeRenderTarget(this.activeRenderTarget);
        }

        // prepare state
        const bounds = entity.filterArea || entity.getBounds();
        const width = bitTwiddle.nextPow2(bounds.width);
        const height = bitTwiddle.nextPow2(bounds.height);

        this.activeBounds.copy(bounds);
        this.activeSize.width = bounds.width;
        this.activeSize.height = bounds.height;

        this.activeRenderTarget = this.getRenderTarget(renderer.gl, width, height);

        renderer.state.setRenderTarget(this.activeRenderTarget);
    },

    /**
     * Gets a render target that a filter can use.
     *
     * @memberof filters.FilterUtils
     * @param {WebGLRenderingContext} gl - The context to create it for.
     * @param {number} width - The width of the render target to set.
     * @param {number} height - The height of the render target to set.
     * @return {RenderTarget} The render target.
     */
    getRenderTarget(gl, width = this.activeBounds.width, height = this.activeBounds.height /* , resolution */)
    {
        width = bitTwiddle.nextPow2(width /* * resolution */);
        height = bitTwiddle.nextPow2(height /* * resolution */);

        const renderTarget = this._renderTargetPool.pop() || new render.RenderTarget(gl, width, height);

        renderTarget
            .resize(width, height)
            .setFrame(this.activeSize, this.activeBounds);

        return renderTarget;
    },

    /**
     * Returns a render target to the pool for use later.
     *
     * @memberof filters.FilterUtils
     * @param {RenderTarget} renderTarget - The render target.
     */
    freeRenderTarget(renderTarget)
    {
        this._renderTargetPool.push(renderTarget);
    },
};
