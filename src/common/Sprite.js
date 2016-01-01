import VertexArray from '../core/VertexArray.js';

export default class Sprite
{
    /**
     * Creates a new sprite.
     *
     * @param {!WebGLTexture} texture - The texture to use.
     * @param {VertexArray} [batchArray] - The vertex array object for this sprite to insert itself into
     * @param {number} [batchIndex] - The index at which this sprite should manipulate the vertex array
     */
    constructor(texture, batchArray, batchIndex)
    {
        this.texture = texture;
        this.transform = mat4.create();
        this.vertexArray = new VertexArray(null, 4, 6, true, true, false, false);
        this._fillVertexArray();

        this.x = 0;
        this.y = 0;
        this.u = 0;
        this.v = 0;
        this.tint = 0xffffff;
    }

    /**
     * Draws the sprite.
     *
     * @param {!RenderTarget} target - The target to draw to.
     * @param {!RenderState} state - The state object to setup for this draw.
     */
    draw(target, state)
    {
        if (this.texture)
        {
            mat4.multiply(state.transform, state.transform, this.transform);
            state.texture = this.texture;

            target.draw(this.vertexArray.vertices, this.vertexArray.indices, state);
        }
    }

    _fillVertexArray()
    {
        let a = this.vertexArray;

        // indices
        a.indices[0] = 0;
        a.indices[1] = 1;
        a.indices[2] = 2;
        a.indices[3] = 0;
        a.indices[4] = 2;
        a.indices[5] = 3;

        // vertex 1
        a.vertices[0] = this.x;
        a.vertices[1] = this.y;
        a.vertices[2] = this.u;
        a.vertices[3] = this.v;
        a.vertices[4] = this.tint;

        // etc
    }
}
