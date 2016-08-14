import BoundingBox from './BoundingBox';

export default function BoundsComponent(Base)
{
    /**
     * @class BoundsComponent
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

            /**
             * Tracker for if the bounds are dirty. Each time the object
             * is updated, the bounds are marked as dirty and recalculated
             * next time they are requested.
             *
             * @private
             * @member {boolean}
             */
            this._boundsDirty = true;
        }

        /**
         * Returns the bounding box of this scene object.
         *
         * @return {BoundingBox} The object's bounding box.
         */
        getBounds()
        {
            if (this._boundsDirty)
            {
                this._updateBounds();
            }

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
            this._boundsDirty = false;
        }
    };
}
