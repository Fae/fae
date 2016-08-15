import System from './System';

/**
 * @class
 */
export default class RenderSystem extends System {
    /**
     * @param {Renderer} renderer - The renderer to use.
     */
    constructor(renderer)
    {
        super();

        /**
         * The renderer to use.
         *
         * @member {Renderer}
         */
        this.renderer = renderer;

        // set priority to render
        this.priority = System.PRIORITY.RENDER;
    }

    /**
     * Called when an entity is added to the system.
     *
     * @param {Entity} entity - The added entity.
     */
    enter(/* entity */)
    {
        this.entities.sort(compareZIndex);
    }
}

function compareZIndex(a, b)
{
    if (!b.transform || !a.transform) return 0;

    return a.transform.z - b.transform.z;
}
