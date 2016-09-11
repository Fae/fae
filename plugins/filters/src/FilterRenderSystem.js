/**
 * This file contains code that was taken from, or heavily based upon, code
 * from the pixi.js project. Those sections are used under the terms of The
 * Pixi License, detailed below:
 *
 * The Pixi License
 *
 * Copyright (c) 2013-2016 Mathew Groves
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
            let flop = FilterUtils.getRenderTarget(this.renderer.gl);
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

            FilterUtils.freeRenderTarget(flop);
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
            gl.enable(gl.SCISSOR_TEST);
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
        if (filter.values.uFilterArea)
        {
            const area = filter.values.uFilterArea;

            area[0] = FilterUtils.activeRenderTarget.size.x;
            area[1] = FilterUtils.activeRenderTarget.size.y;
            area[2] = FilterUtils.activeBounds.x;
            area[3] = FilterUtils.activeBounds.y;
        }

        if (filter.values.uFilterClamp)
        {
            const clamp = filter.values.uFilterClamp;

            clamp[0] = 0.5 / FilterUtils.activeRenderTarget.size.x;
            clamp[1] = 0.5 / FilterUtils.activeRenderTarget.size.y;
            clamp[2] = (FilterUtils.activeBounds.width - 0.5) / FilterUtils.activeRenderTarget.size.x;
            clamp[3] = (FilterUtils.activeBounds.height - 0.5) / FilterUtils.activeRenderTarget.size.y;
        }
    }
}

render.Renderer.addDefaultSystem(FilterRenderSystem);
