import { util } from '@fae/core';

export default function SpriteComponent(Base)
{
    /**
     * @class SpriteComponent
     */
    return class extends Base
    {
        /**
         *
         */
        constructor()
        {
            super(...arguments); // eslint-disable-line prefer-rest-params

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
             * The vertex data used to draw the sprite.
             *
             * @readonly
             * @member {Float32Array}
             */
            this.vertexData = new Float32Array(8);

            /**
             * Custom shader to use for drawing instead of the built-in batched shader.
             * Warning: Setting this property will break the batch of sprites as it
             * will need to be drawn in isolation.
             *
             * @member {Shader|GLShader}
             */
            this.shader = null;

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
    };
}
