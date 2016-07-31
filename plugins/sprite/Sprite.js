import { SceneObject } from '@fae/scene';
import { Texture } from '@fae/textures';
import { util } from '@fae/core';
import SpriteRenderer from './SpriteRenderer';

/**
 * A Sprite is a textured SceneObject. It is implemented as a quad
 * with a texture drawn on it. You can modify properties to make it
 * render differently, including assinging custom shaders.
 *
 * @class
 */
export default class Sprite extends SceneObject
{
    /**
     * @param {Texture} texture - The texture to use.
     */
    constructor(texture = Texture.EMPTY)
    {
        super();

        /**
         * The tint to apply to the sprite. A value of white will render without
         * any tinting. This works because this color value is multiplied against
         * the actual color value in the texture (per pixel).
         *
         * @member {Color}
         */
        this.tint = util.Color.WHITE.clone();

        /**
         * The blend mode to be applied to the sprite.
         *
         * @member {BlendMode}
         * @default BlendMode.NORMAL
         */
        this.blendMode = util.BlendMode.NORMAL;

        /**
         * A custom shader that will be used to render the sprite. Set to
         * `null` to use the default shader.
         *
         * @member {Shader}
         */
        this.shader = null;

        /**
         * The vertex data used to draw the sprite.
         *
         * @readonly
         * @member {Float32Array}
         */
        this.vertexData = new Float32Array(8);

        /**
         * The X coord of the attachment point of the texture.
         *
         * @private
         * @member {number}
         */
        this._anchorX = 0;

        /**
         * The Y coord of the attachment point of the texture.
         *
         * @private
         * @member {number}
         */
        this._anchorY = 0;

        /**
         * Tracker for if the vertices are dirty.
         *
         * @private
         * @member {number}
         */
        this._vertsDirty = true;

        /**
         * The texture object to use.
         *
         * @private
         * @member {Texture}
         */
        this._texture = null;
        this._onTextureUpdateBinding = null;

        this._cachedTransformUpdateId = -1;

        // run texture setter
        this.texture = texture;
    }

    /**
     * The X coord of the attachment point of the texture.
     *
     * @member {number}
     */
    get anchorX()
    {
        return this._anchorX;
    }

    /**
     * @param {number} v - The new anchor.
     */
    set anchorX(v)
    {
        if (this._anchorX === v) return;

        this._anchorX = v;
        this._vertsDirty = true;
    }

    /**
     * The Y coord of the attachment point of the texture.
     *
     * @member {number}
     */
    get anchorY()
    {
        return this._anchorY;
    }

    /**
     * @param {number} v - The new anchor.
     */
    set anchorY(v)
    {
        if (this._anchorY === v) return;

        this._anchorY = v;
        this._vertsDirty = true;
    }

    /**
     * The texture to use.
     *
     * @member {Texture}
     */
    get texture()
    {
        return this._texture;
    }

    /**
     * @param {Texture} v - The new texture.
     */
    set texture(v)
    {
        if (this._texture === v) return;

        if (this._onTextureUpdateBinding)
        {
            this._onTextureUpdateBinding.detach();
            this._onTextureUpdateBinding = null;
        }

        this._texture = v;
        this._vertsDirty = true;

        if (v)
        {
            this._onTextureUpdateBinding = v.onUpdate.add(this._onTextureUpdate, this);

            if (v.ready)
            {
                this._onTextureUpdate();
            }
        }
    }

    /**
     * Updates the object properties to prepare it for rendering.
     *
     * - Multiply transform matrix by the parent matrix,
     * - Multiply local alpha by the parent world alpha,
     * - Update the boundingBox
     */
    update()
    {
        if (!this.visible) return;

        const parent = this.parent || SceneObject.EMPTY;

        this.transform.update(parent.transform);
        this.worldAlpha = this.alpha * parent.worldAlpha;

        if (this._texture.ready && (this._vertsDirty || this._cachedTransformUpdateId !== this.transform._updateId))
        {
            this.calculateVertices();
            this._cachedTransformUpdateId = this.transform._updateId;
            this._vertsDirty = false;
        }
    }

    /**
     * Called to test if this object contains the passed in point.
     *
     * @param {number} x - The x coord to check.
     * @param {number} y - The y coord to check.
     * @return {SceneObject} The SceneObject that was hit, or null if nothing was.
     */
    hitTest(x, y)
    {
        if (this.bounds.contains(x, y))
        {
            return this;
        }

        return null;
    }

    /**
     * Called for this object to render itself.
     *
     * @private
     * @param {!Renderer} renderer - The renderer to render with.
     */
    render(renderer)
    {
        renderer.setObjectRenderer(SpriteRenderer);
        renderer.currentRenderer.render(this);
    }

    /**
     * Calculates the vertices used to draw the sprite.
     *
     */
    calculateVertices()
    {
        // set the vertex data
        const wt = this.transform.worldTransform;
        const a = wt.a;
        const b = wt.b;
        const c = wt.c;
        const d = wt.d;
        const tx = wt.tx;
        const ty = wt.ty;
        const vertexData = this.vertexData;
        const trim = this._texture.trim;
        const orig = this._texture.orig;

        let w0;
        let w1;
        let h0;
        let h1;

        if (trim)
        {
            // if the sprite is trimmed then we need to add the extra space
            // before transforming the sprite coords.
            w1 = trim.x - (this._anchorX * orig.width);
            w0 = w1 + trim.width;

            h1 = trim.y - (this._anchorY * orig.height);
            h0 = h1 + trim.height;
        }
        else
        {
            w0 = (orig.width) * (1 - this._anchorX);
            w1 = (orig.width) * -this._anchorX;

            h0 = orig.height * (1 - this._anchorY);
            h1 = orig.height * -this._anchorY;
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

        this._boundsDirty = true;
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
        super.destroy(options);

        const destroyTexture = typeof options === 'boolean' ? options : options && options.texture;

        if (destroyTexture)
        {
            this.texture.destroy(options);
        }

        this.tint = null;
        this.blendMode = null;
        this.shader = null;
        this.vertexData = null;

        this._texture = null;

        if (this._onTextureUpdateBinding)
        {
            this._onTextureUpdateBinding.detach();
            this._onTextureUpdateBinding = null;
        }
    }

    /**
     * Called when the underlying texture updates.
     *
     */
    _onTextureUpdate()
    {
        this._vertsDirty = true;
    }

    /**
     * Updates the bounds of this object.
     *
     * @protected
     */
    _updateBounds()
    {
        this._bounds.clear();
        this._boundsDirty = false;

        if (!this.visible) return;

        this._bounds.addQuad(this.vertexData);
    }
}
