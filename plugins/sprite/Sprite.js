import { Container } from '@fay/scene';
import { math } from '@fay/core';

/**
 * @class
 */
export default class Sprite extends Container
{
    /**
     * Creates a new sprite.
     *
     * @param {!WebGLTexture} texture - The texture to use.
     * @param {VertexArray} [batchArray] - The vertex array object for this sprite to insert itself into
     * @param {number} [batchIndex] - The index at which this sprite should manipulate the vertex array
     */
    constructor(texture)
    {
        super();

        this.texture = texture;
        this.vertexData = new Float32Array(16);
        this.anchor = new math.Vectord2d();
    }

    /**
     * Called for this object to render itself.
     *
     * @param {!RenderTarget} target - The target to draw to.
     * @param {!RenderState} state - The state object to setup for this draw.
     */
    render(target, state)
    {
        this.calculateVertices();

        renderer.setObjectRenderer(renderer.plugins.sprite);
        renderer.plugins.sprite.render(this);
    }

    /**
     * Calculates the vertices used to draw the sprite.
     */
    calculateVertices()
    {
        // set the vertex data
        const texture = this._texture;
        const wt = this.transform.worldTransform;
        const a = wt.a;
        const b = wt.b;
        const c = wt.c;
        const d = wt.d;
        const tx = wt.tx;
        const ty = wt.ty;
        const vertexData = this.vertexData;
        const trim = texture.trim;
        const orig = texture.orig;
        let w0;
        let w1;
        let h0;
        let h1;

        if (trim)
        {
            // if the sprite is trimmed and is not a tilingsprite then we
            // need to add the extra space before transforming the sprite coords..
            w1 = trim.x - (this.anchor.x * orig.width);
            w0 = w1 + trim.width;

            h1 = trim.y - (this.anchor.y * orig.height);
            h0 = h1 + trim.height;
        }
        else
        {
            w0 = (orig.width) * (1 - this.anchor.x);
            w1 = (orig.width) * -this.anchor.x;

            h0 = orig.height * (1 - this.anchor.y);
            h1 = orig.height * -this.anchor.y;
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
     * Destroys the sprite.
     *
     * @param {object|boolean} options - A boolean will act as if all options are set.
     * @param {boolean} [options.children=false] - If true all children will also be destroyed.
     * `options` is passed through to those calls.
     * @param {boolean} [options.texture=false] - If true the texture is also destroyed.
     * @param {boolean} [options.baseTexture=false] - If true the texture's base texture is also destroyed.
     */
    destroy(options)
    {
        const destroyTexture = typeof options === 'boolean' ? options : options && options.texture;

        if (destroyTexture)
        {
            const destroyBaseTexture = typeof options === 'boolean' ? options : options && options.baseTexture;

            this.texture.destroy(destroyBaseTexture);
        }

        this.texture = null;
        this.vertexData = null;
        this.anchor = null;
    }
}
