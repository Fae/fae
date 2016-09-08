import { ecs, render, glutil } from '@fae/core';
import FilterComponent from './FilterComponent';
import FilterUtils from './FilterUtils';

/**
 * @class
 * @memberof filters
 */
export default class FilterRenderSystem extends ecs.System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = (ecs.System.PRIORITY.RENDER + 500), frequency = 1)
    {
        super(renderer, priority, frequency);

        this.quad = null;
        this.tempRenderTarget = null;

        this._onContextChangeBinding = renderer.onContextChange.add(this._onContextChange, this);

        this._onContextChange();
    }

    /**
     * Called by base Manager class when there is a WebGL context change.
     *
     * @private
     */
    _onContextChange()
    {
        if (this.quad) this.quad.destroy();

        this.quad = new glutil.GLQuad(this.renderer.gl);

        // TODO: clear and reset FilterUtils renderTargets
    }

    /**
     * Returns true if the entity is eligible to the system, false otherwise.
     *
     * @param {Entity} entity - The entity to test.
     * @return {boolean} True if entity should be included.
     */
    test(entity)
    {
        return entity.hasComponent(FilterComponent);
    }

    /**
     * Render the entity using filtered rendering.
     *
     * @param {Entity} entity - The entity to update
     */
    update(entity)
    {
        if (entity.filters.length === 0) return;

        // stop obj renderer
        this.renderer.activeObjectRenderer.stop();

        // process the filters
        this.quad.map(FilterUtils.activeRenderTarget, FilterUtils.activeRenderTarget).upload();

        if (entity.filters.length === 1)
        {
            const filter = entity.filters[0];

            if (filter.enable)
            {
                this.quad.initVao(filter);
                filter.run(this, FilterUtils.activeRenderTarget, FilterUtils.initialRenderTarget, false);
            }
        }
        else
        {
            let flip = FilterUtils.activeRenderTarget;
            let flop = FilterUtils.tempRenderTarget;
            let i = 0;

            for (i = 0; i < entity.filters.length - 1; ++i)
            {
                const filter = entity.filters[i];

                if (!filter.enable) continue;

                this.quad.initVao(filter);
                filter.run(this, flip, flop, true);
                this.quad.draw();

                const t = flip;

                flip = flop;
                flop = t;
            }

            entity.filters[i].run(this, flip, FilterUtils.initialRenderTarget, false);
        }

        // start obj renderer
        this.renderer.activeObjectRenderer.start();
    }

    /**
     * Draws a filter.
     *
     * @param {Filter} filter - The filter to draw.
     * @param {RenderTarget} input - The render target to use as input.
     * @param {RenderTarget} output - The render target to use as output.
     * @param {boolean} clear - Should the output buffer be cleared before use?
     */
    drawFilter(filter, input, output, clear)
    {
        const gl = this.renderer.gl;
        const state = this.renderer.state;

        state.setRenderTarget(output);

        if (clear)
        {
            gl.disable(gl.SCISSOR_TEST);
            output.clear();
            gl.disable(gl.SCISSOR_TEST);
        }

        state.setShader(filter);
        state.setBlendMode(filter.blendMode);

        input.framebuffer.texture.bind(0);

        this.quad.draw();
    }
}

render.Renderer.addDefaultSystem(FilterRenderSystem);
