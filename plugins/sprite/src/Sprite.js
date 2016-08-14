import { ecs } from '@fae/core';
import { Texture } from '@fae/textures';
import { TransformComponent } from '@fae/transform';
import SpriteComponent from './SpriteComponent';

/**
 * A Sprite is a textured SceneObject. It is implemented as a quad
 * with a texture drawn on it. You can modify properties to make it
 * render differently, including assinging custom shaders.
 *
 * @class
 * @mixes VisibilityComponent
 * @mixes TransformComponent
 * @mixes SpriteComponent
 */
export default class Sprite extends ecs.Entity.with(
    ecs.VisibilityComponent,    // whether or not to render
    TransformComponent,         // where to render
    SpriteComponent             // what to render
)
{
    /**
     *
     * @param {Texture} texture - The texture to use.
     */
    constructor(texture = Texture.EMPTY)
    {
        super();

        this._onTextureUpdateBinding = null;

        // run texture component setter
        this.texture = texture;
    }

    /**
     * Destroys the sprite.
     *
     * @param {object|boolean} options - A value of `true` will act as if all options are set.
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
     * Called by the texture component when the texture changes.
     *
     * @protected
     */
    _onTextureChange()
    {
        if (this._onTextureUpdateBinding)
        {
            this._onTextureUpdateBinding.detach();
            this._onTextureUpdateBinding = null;
        }

        this._vertsDirty = true;

        if (this._texture)
        {
            this._onTextureUpdateBinding = this._texture.onUpdate.add(this._onTextureUpdate, this);

            if (this._texture.ready)
            {
                this._onTextureUpdate();
            }
        }
    }

    /**
     * Called by the bounds component when someone tries to read the
     * bounds but they are dirty.
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

    /**
     * Called when the underlying texture updates.
     *
     * @private
     */
    _onTextureUpdate()
    {
        this._vertsDirty = true;
    }
}
