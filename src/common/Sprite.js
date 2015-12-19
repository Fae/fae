'use strict';

export default class Sprite {

    /**
     * Creates a new sprite.
     *
     * @param {!texture} texture - The texture to use.
     */
    constructor(texture)
    {
        this.texture = texture;
        this.transform = mat4.create();
        this.vertices = new Float32Array(20); // 4 * (vec2-position + vec2-tex-coord + uint8-color)
        this.indices = new Float32Array([0, 1, 2, 0, 2, 3]);
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
            target.draw(this.vertices, gl.TRIANGLES, states);
        }
    }

}
