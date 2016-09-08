// TODO: World Alpha needs updates...

export default function VisibilityComponent(Base)
{
    /**
     * @class VisibilityComponent
     * @memberof ecs
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
             * Controls the visibility of the object. If false, not rendered.
             *
             * @member {boolean}
             * @default true
             */
            this.visible = true;

            /**
             * The alpha of the object when rendered.
             * 0 = transparent, 1 = opaque.
             *
             * @member {number}
             * @default 1
             */
            this.alpha = 1;

            /**
             * The world alpha of the object (local alpha * parent alpha).
             * 0 = transparent, 1 = opaque.
             *
             * @member {number}
             * @default 1
             */
            this.worldAlpha = 1;
        }
    };
}
