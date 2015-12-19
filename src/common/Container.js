'use strict';

// positionX, positionY, colorR, colorG, colorB = 5 values
// each value is a 32-bit number (4 bytes) so thats = 20 bytes
const VERT_BYTE_SIZE = 20;

// there are 6 indices per quad this container draws
const NUM_INDICES = 6;

export default class Container {

    /**
     * Creates a new sprite.
     *
     * @param {number} [size=2000] - The maximum batch size of this container.
     */
    constructor(size = 2000)
    {
        // The total number of bytes in the batch is (VERT_BYTE_SIZE * size)
        this.vertices = new ArrayBuffer(size * VERT_BYTE_SIZE);
        this.indices = new Uint16Array();


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

    _createVertexBuffer(size)
    {

    }

}
