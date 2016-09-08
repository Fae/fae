export default function SelfRenderComponent(Base)
{
    /**
     * @class SelfRenderComponent
     * @memberof ecs
     */
    return class extends Base
    {
        /**
         * The method called for the object to render itself.
         *
         * @abstract
         * @param {Renderer} renderer - The renderer to use.
         */
        render(/* renderer */)
        {
            /* empty */
        }
    };
}
