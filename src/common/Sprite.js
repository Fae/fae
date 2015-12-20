'use strict';

export default class Sprite
{
    /**
     * Creates a new sprite.
     *
     * @param {!WebGLTexture} texture - The texture to use.
     */
    constructor(texture)
    {
        this.texture = texture;
        this.transform = mat4.create();

        // still thinking about batching...
        this.vertexArray = new VertexArray(target.gl, 4, 6, true, true, false, false);
    }

    /**
     * Draws the sprite.
     *
     * @param {!RenderTarget} target - The target to draw to.
     * @param {!RenderStates} states - The states object to setup state on.
     */
    draw(target, states)
    {
        if (this.texture)
        {
            mat4.multiply(states.transform, states.transform, this.transform);
            states.texture = this.texture;

            target.draw(this.vertexArray.vertices, this.vertexArray.indices, states);
        }
    }
}
