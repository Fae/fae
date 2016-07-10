/**
 * @class
 */
export default class Manager
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

        this._onContextChangeBinding = renderer.onContextChange.add(this.onContextChange, this);
    }

    /**
     * Called when there is a WebGL context change.
     *
     */
    onContextChange()
    {
        // no base implementation
    }

    /**
     * Destroys the manager instance.
     *
     */
    destroy()
    {
        this.renderer.onContextChange.detach(this._onContextChangeBinding);

        this.renderer = null;
        this._onContextChangeBinding = null;
    }
}
