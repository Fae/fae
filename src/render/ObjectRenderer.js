import Manager from './managers/Manager';

/**
 * @class
 */
export default class ObjectRenderer extends Manager
{
    /**
     * Starts the renderer, usually shader setup is done here.
     *
     */
    start()
    {
        // no base implementation
    }

    /**
     * Stops the renderer, usually and teardown work is done here.
     *
     */
    stop()
    {
        this.flush();
    }

    /**
     * Renders the buffered content and empties the current batch.
     *
     */
    flush()
    {
        // no base implementation
    }

    /**
     * Renders a scene object, usually by buffering the geom to the batch if it can.
     *
     * @param {*} object - The object to render.
     */
    render(object) // eslint-disable-line no-unused-vars
    {
        // no base implementation
    }
}
