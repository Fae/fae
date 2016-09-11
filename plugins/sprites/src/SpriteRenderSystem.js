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
import { ecs, render } from '@fae/core';
import { TransformComponent } from '@fae/transform';
import { TextureComponent } from '@fae/textures';
import SpriteRenderer from './SpriteRenderer';
import SpriteComponent from './SpriteComponent';

/**
 * @class
 * @memberof sprites
 */
export default class SpriteRenderSystem extends ecs.System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = SpriteRenderSystem.defaultPriority, frequency = 1)
    {
        super(renderer, priority, frequency);

        /**
         * The sprite renderer instance to use to draw/batch sprites.
         *
         * @member {SpriteRenderer}
         */
        this.spriteRenderer = new SpriteRenderer(renderer);
    }

    /**
     * Returns true if the entity is eligible to the system, false otherwise.
     *
     * @param {Entity} entity - The entity to test.
     * @return {boolean} True if entity should be included.
     */
    test(entity)
    {
        return entity.hasComponents(
            ecs.VisibilityComponent,    // whether or not to render
            TransformComponent,         // where to render
            TextureComponent,           // what to render
            SpriteComponent             // how to render
        );
    }

    /**
     * Render a sprite using the batching SpriteRenderer.
     *
     * @param {Entity} sprite - The entity to render.
     */
    update(sprite)
    {
        if (!sprite.visible) return;

        this.renderer.setActiveObjectRenderer(this.spriteRenderer);

        const clean = !sprite._anchorDirty && sprite._cachedTransformUpdateId === sprite.transform._worldUpdateId;

        if (sprite._texture.ready && !clean)
        {
            calculateVertices(sprite);
            sprite._cachedTransformUpdateId = sprite.transform._worldUpdateId;
            sprite._anchorDirty = false;
        }

        this.spriteRenderer.render(sprite);
    }
}

render.Renderer.addDefaultSystem(SpriteRenderSystem);

/**
 * Updates the vertices of the entity.
 *
 * @ignore
 * @param {Entity} sprite - The sprite to update.
 */
function calculateVertices(sprite)
{
    // set the vertex data
    const wt = sprite.transform.worldTransform;
    const a = wt.a;
    const b = wt.b;
    const c = wt.c;
    const d = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const vertexData = sprite.vertexData;
    const trim = sprite._texture.trim;
    const orig = sprite._texture.orig;

    let w0;
    let w1;
    let h0;
    let h1;

    if (trim)
    {
        // if the sprite is trimmed then we need to add the extra space
        // before transforming the sprite coords.
        w1 = trim.x - (sprite._anchorX * orig.width);
        w0 = w1 + trim.width;

        h1 = trim.y - (sprite._anchorY * orig.height);
        h0 = h1 + trim.height;
    }
    else
    {
        w0 = (orig.width) * (1 - sprite._anchorX);
        w1 = (orig.width) * -sprite._anchorX;

        h0 = orig.height * (1 - sprite._anchorY);
        h1 = orig.height * -sprite._anchorY;
    }

    // xy
    vertexData[0] = (a * w1) + (c * h1) + tx;
    vertexData[1] = (d * h1) + (b * w1) + ty;

    // xy
    vertexData[2] = (a * w0) + (c * h1) + tx;
    vertexData[3] = (d * h1) + (b * w0) + ty;

    // xy
    vertexData[4] = (a * w0) + (c * h0) + tx;
    vertexData[5] = (d * h0) + (b * w0) + ty;

    // xy
    vertexData[6] = (a * w1) + (c * h0) + tx;
    vertexData[7] = (d * h0) + (b * w1) + ty;
}

/**
 * @static
 * @constant
 * @member {number}
 * @default 1000
 */
SpriteRenderSystem.defaultPriority = ecs.System.PRIORITY.RENDER;
