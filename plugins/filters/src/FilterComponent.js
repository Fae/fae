export default function FilterComponent(Base)
{
    /**
     * @class FilterComponent
     * @memberof filters
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
             * The filters to apply to this object.
             *
             * @member {Filter[]}
             */
            this.filters = [];

            /**
             * The area to use to filter, relative to the object's frame. Either this
             * rectangle must exist, or the entity needs to have the bounds component.
             *
             * When rendering filters the system tries to get this value, and if it
             * doesn't exist calls `getBounds()` instead.
             *
             * @member {Rectangle}
             */
            this.filterArea = null;
        }
    };
}
