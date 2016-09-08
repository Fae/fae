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
        this.quad.map(FilterUtils.activeRenderTarget, FilterUtils.activeBounds).upload();

        if (entity.filters.length === 1)
        {
            const filter = entity.filters[0];

            if (filter.enable)
            {
                filter.run(this, FilterUtils.activeRenderTarget, FilterUtils.initialRenderTarget, false);
            }
        }
        else
        {
            const activeFilters = [];
            let flip = FilterUtils.activeRenderTarget;
            let flop = FilterUtils.tempRenderTarget;
            let i = 0;

            for (i = 0; i < entity.filters.length - 1; ++i)
            {
                if (entity.filters[i].enable)
                {
                    activeFilters.push(entity.filters[i]);
                }
            }

            for (i = 0; i < activeFilters.length - 1; ++i)
            {
                const filter = activeFilters[i];

                filter.run(this, flip, flop, true);

                const t = flip;

                flip = flop;
                flop = t;
            }

            activeFilters[i].run(this, flip, FilterUtils.initialRenderTarget, false);
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

        this.quad.initVao(filter);

        state.setRenderTarget(output);

        if (clear)
        {
            gl.disable(gl.SCISSOR_TEST);
            output.clear();
            gl.disable(gl.SCISSOR_TEST);
        }

        state.setShader(filter);

        this._setAutomaticUniforms(filter);

        filter.syncUniforms();

        input.framebuffer.texture.bind(0);

        state.setBlendMode(filter.blendMode);

        this.quad.draw();
    }

    /**
     * Sets some uniforms (if they exist) automatically for the user.
     *
     * @private
     * @param {Filter} filter - The filter to setup.
     */
    _setAutomaticUniforms(filter)
    {
        if (filter.values.filterArea)
        {
            const area = filter.values.filterArea;

            area[0] = FilterUtils.activeRenderTarget.size.x;
            area[1] = FilterUtils.activeRenderTarget.size.y;
            area[2] = FilterUtils.activeBounds.x;
            area[3] = FilterUtils.activeBounds.y;
        }

        if (filter.values.filterClamp)
        {
            const clamp = filter.values.filterClamp;

            clamp[0] = 0.5 / FilterUtils.activeRenderTarget.size.x;
            clamp[1] = 0.5 / FilterUtils.activeRenderTarget.size.y;
            clamp[2] = (FilterUtils.activeBounds.width - 0.5) / FilterUtils.activeRenderTarget.size.x;
            clamp[3] = (FilterUtils.activeBounds.height - 0.5) / FilterUtils.activeRenderTarget.size.y;
        }

        // TODO: How do users set textures on a filter? Right now, the auto detection
        // would accept a number. Maybe special handling at the `Shader` level to handle
        // special types that are easier to work as objects?
        // Maybe after shader inits, iterate through the uniform accessors and override
        // ones of complex types (`sampler2D`, `mat3`, `vec2`, etc.)
        //
        // Pixi keeps filter props separate and copies them here, but I think this problem
        // is on the shader level as well...
    }
}

render.Renderer.addDefaultSystem(FilterRenderSystem);
