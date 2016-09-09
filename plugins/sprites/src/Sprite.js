import { ecs } from '@fae/core';
import { TransformComponent } from '@fae/transform';
import { Texture, TextureComponent } from '@fae/textures';
import SpriteComponent from './SpriteComponent';
import SpriteRenderer from './SpriteRenderer';

/**
 * A Sprite is a textured entity. It is implemented as a quad
 * with a texture drawn on it.
 *
 * @class
 * @mixes VisibilityComponent
 * @mixes TransformComponent
 * @mixes SpriteComponent
 * @memberof sprites
 */
export default class Sprite extends ecs.Entity.with(
    ecs.VisibilityComponent,    // whether or not to render
    TransformComponent,         // where to render
    TextureComponent,           // what to render
    SpriteComponent             // how to render
)
{
    /**
     *
     * @param {Texture} texture - The texture to use.
     */
    constructor(texture = Texture.EMPTY)
    {
        super();

        this.renderGroupHint = SpriteRenderer;

        this._onTextureUpdateBinding = null;

        // run texture component setter
        this.texture = texture;
    }

    /**
     * Destroys the sprite.
     *
     * @param {object|boolean} options - A boolean value will act as if all options are set to that value.
     * @param {boolean} options.texture=false - If true the texture is also destroyed.
     * @param {boolean} options.baseTexture=false - If true the texture's base texture is also destroyed.
     */
    destroy(options = false)
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
     * Called when the underlying texture updates.
     *
     * @private
     */
    _onTextureUpdate()
    {
        this._vertsDirty = true;
    }
}
