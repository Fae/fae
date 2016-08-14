import { BoundsComponent } from '@fae/shapes';

export default function InteractionComponent(Base)
{
    /**
     * @class InteractionComponent
     * @mixes BoundsComponent
     */
    return class extends BoundsComponent(Base)
    {
        /**
         * Called to test if this object contains the passed in point.
         *
         * @param {number} x - The x coord to check.
         * @param {number} y - The y coord to check.
         * @return {SceneObject} The SceneObject that was hit, or null if nothing was.
         */
        hitTest(x, y)
        {
            if (this.getBounds().contains(x, y))
            {
                return this;
            }

            return null;
        }
    };
}
