export default function TextureComponent(Base)
{
    /**
     * @class TextureComponent
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
             * The texture object.
             *
             * @private
             * @member {Texture}
             */
            this._texture = null;

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
            this._anchorDirty = true;
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

            this._texture = v;

            this._onTextureChange();
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
            this._anchorDirty = true;
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
            this._anchorDirty = true;
        }

        /**
         * Called when the underlying texture changes.
         *
         * @protected
         * @abstract
         */
        _onTextureChange()
        {
            /* empty */
        }
    };
}
