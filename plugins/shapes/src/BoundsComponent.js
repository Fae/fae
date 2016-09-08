import BoundingBox from './BoundingBox';

export default function BoundsComponent(Base)
{
    /**
     * @class BoundsComponent
     * @memberof shapes
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
             * The bounding box of this scene object.
             *
             * @private
             * @member {BoundingBox}
             */
            this._bounds = new BoundingBox();
        }

        /**
         * Returns the bounding box of this scene object.
         *
         * @return {BoundingBox} The object's bounding box.
         */
        getBounds()
        {
            this._updateBounds();

            return this._bounds;
        }

        /**
         * Updates the bounds of this object.
         *
         * @protected
         */
        _updateBounds()
        {
            this._bounds.clear();
        }
    };
}
