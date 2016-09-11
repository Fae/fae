export default function BitmapTextComponent(Base)
{
    /**
     * @class BitmapTextComponent
     * @memberof text-bitmap
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
             * Private tracker for the letter sprite pool.
             *
             * @private
             * @member {Array<*>}
             */
            this._glyphs = [];

            /**
             * Private tracker for the current text.
             *
             * @private
             * @member {string}
             */
            this._text = '';

            /**
             * The max width of this bitmap text in pixels. If the text provided is longer than
             * the value provided, line breaks will be automatically inserted in the last whitespace.
             * Disable by setting value to 0.
             *
             * @member {number}
             */
            this.maxWidth = 0;

            /**
             * The max line height. This is useful when trying to use the total height of the Text,
             * ie: when trying to vertically align.
             *
             * @member {number}
             */
            this.maxLineHeight = 0;
        }
    };
}
