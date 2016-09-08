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
             * The area to use to filter, relative to the object's frame.
             *
             * @member {Rectangle}
             */
            this.filterArea = null;

            this.filterPadding = 0;
        }
    };
}
