import Transform from './Transform';

export default function TransformComponent(Base)
{
    /**
     * @class TransformComponent
     * @memberof transform
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
             * The transformation of the object.
             *
             * @member {Transform}
             */
            this.transform = new Transform();

            /**
             * The last transform update ID that this object has seen.
             *
             * @private
             * @member {number}
             */
            this._cachedTransformUpdateId = -1;
        }
    };
}
