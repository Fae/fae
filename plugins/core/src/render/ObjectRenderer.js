/**
 * An ObjectRenderer is any renderer that is capable of rendering a single entity, or
 * a batch of similar entities.
 *
 * @class
 * @abstract
 * @memberof render
 */
export default class ObjectRenderer
{
    /**
     * @param {Renderer} renderer - The renderer this manager works for.
     */
    constructor(renderer)
    {
        /**
         * The renderer this manager works for.
         *
         * @member {Renderer}
         */
        this.renderer = renderer;
    }

    /**
     * Starts the renderer, called when this becomes the active object renderer.
     *
     */
    start()
    {
        // no base implementation
    }

    /**
     * Stops the renderer, called when this is no longer the active object renderer.
     *
     */
    stop()
    {
        // no base implementation
    }

    /**
     * Renders an object, usually called by a system in the update loop.
     *
     * @param {*} object - The object to render.
     */
    render(object) // eslint-disable-line no-unused-vars
    {
        // no base implementation
    }

    /**
     * Destroys the object renderer instance.
     *
     */
    destroy()
    {
        this.renderer = null;
    }
}
