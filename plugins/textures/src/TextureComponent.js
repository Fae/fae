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
