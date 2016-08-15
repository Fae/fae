import Signal from 'mini-signals';
import ECS from '@fae/ecs';
import GLContext from '../gl/GLContext';
import RenderTarget from './RenderTarget';
import RenderState from './RenderState';
import { uid } from '../util';

/**
 * The Renderer is just a container for the WebGLRenderingContext, the render state,
 * and the current object renderer that is doing the rendering.
 *
 * @class
 */
export default class Renderer extends ECS
{
    /**
     * Creates a new renderer.
     *
     * @param {!HTMLCanvasElement|WebGLRenderingContext} context - The canvas to create a context from,
     *  or the context to use to draw.
     * @param {object} [options] - Options for the renderer
     * @param {boolean} [options.clearBeforeRender=true] - Should we clear before each render?
     * @param {boolean} [options.preserveDrawingBuffer=false] - Enables drawing buffer preservation,
     *  enable this if you need to call toDataUrl on the webgl context.
     */
    constructor(context, options = {})
    {
        super();

        /**
         * The main rendering context used for drawing.
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = (context.nodeName ? GLContext.create(context) : context);

        /**
         * A unique ID for this renderer, useful for keying maps by renderer
         *
         * @member {number}
         */
        this.uid = uid();

        /**
         * Should we clear before each frame?
         *
         * @member {boolean}
         */
        this.clearBeforeRender = typeof options.clearBeforeRender !== 'undefined' ? options.clearBeforeRender : true;

        /**
         * Should we preserve the drawing buffer each frame?
         *
         * @member {boolean}
         */
        this.preserveDrawingBuffer = options.preserveDrawingBuffer || false;

        /**
         * Dispatched when context has been lost.
         *
         * @member {Signal}
         */
        this.onContextLost = new Signal();

        /**
         * Dispatched when context has been restored, but before the renderer
         * has initialized for the new context.
         *
         * If you are wanting to know when you should reinitialize your stuff
         * after a restore use {@link Renderer#onContextChange}.
         *
         * @member {Signal}
         */
        this.onContextRestored = new Signal();

        /**
         * Dispatched when context has changed. This happens when the renderer
         * initializes and then again if the context is restored, after we initialize
         * the context again.
         *
         * @member {Signal}
         */
        this.onContextChange = new Signal();

        /**
         * Dispatched each frame before rendering the object.
         *
         * @member {Signal}
         */
        this.onBeforeRender = new Signal();

        /**
         * Dispatched each frame after rendering the object.
         *
         * @member {Signal}
         */
        this.onAfterRender = new Signal();

        /**
         * The current state of the renderer.
         *
         * @member {WebGLState}
         */
        this.state = new RenderState(this);

        /**
         * The root render target, that represents the screen.
         *
         * @member {RenderTarget}
         */
        this.screen = null;

        this._boundOnContextLost = this._onContextLost.bind(this);
        this._boundOnContextRestored = this._onContextRestored.bind(this);

        this.gl.canvas.addEventListener('webglcontextlost', this._boundOnContextLost);
        this.gl.canvas.addEventListener('webglcontextrestored', this._boundOnContextRestored);

        // initialize for a new context
        this._initContext();
    }

    /**
     * Add a system to the renderer.
     *
     * @param {System} system - system to add
     */
    addSystem(system)
    {
        super.addSystem(system);

        // sort by priority
        this.systems.sort(compareSystemsPriority);
    }

    /**
     * Renders a drawable object to the render target.
     *
     * @param {RenderTarget} target - The target to render to, defaults to the screen.
     * @param {boolean} clear - Should we clear the screen before rendering?
     * @param {Matrix2d} transform - An optional matrix transform to apply for this render.
     */
    render(target = this.screen, clear = this.clearBeforeRender, transform = null)
    {
        // if no context, or context is lost, just bail.
        if (!this.gl || this.gl.isContextLost()) return;

        // tell everyone we are updating
        this.onBeforeRender.dispatch();

        // set the target
        target.transform = transform;
        this.state.setRenderTarget(target);

        // clear if we should
        if (clear) this.state.target.clear();

        // process all the systems
        this.update();

        // tell everyone we updated
        this.onAfterRender.dispatch();
    }

    /**
     * Destroys this renderer and the related objects.
     *
     */
    destroy()
    {
        // unbind canvas events
        this.gl.canvas.removeEventListener('webglcontextlost', this._boundOnContextLost);
        this.gl.canvas.removeEventListener('webglcontextrestored', this._boundOnContextRestored);

        this._boundOnContextLost = null;
        this._boundOnContextRestored = null;

        // destroy state
        this.state.destroy();

        // detach and lose signals
        this.onContextLost.detachAll();
        this.onContextLost = null;

        this.onContextRestored.detachAll();
        this.onContextRestored = null;

        this.onContextChange.detachAll();
        this.onContextChange = null;

        this.onBeforeRender.detachAll();
        this.onBeforeRender = null;

        this.onAfterRender.detachAll();
        this.onAfterRender = null;

        // finally lose context
        if (this.gl.getExtension('WEBGL_lose_context'))
        {
            this.gl.getExtension('WEBGL_lose_context').loseContext();
        }

        this.gl = null;
    }

    /**
     * Initializes the WebGL context.
     *
     * @private
     */
    _initContext()
    {
        const gl = this.gl;

        this.state.reset();

        if (this.screen)
        {
            this.screen.destroy();
        }

        this.screen = new RenderTarget(gl, gl.canvas.width, gl.canvas.height, RenderTarget.defaultScaleMode, true);

        this.state.setRenderTarget(this.screen);

        // this.resize(gl.canvas.width, gl.canvas.height);

        this.onContextChange.dispatch(gl);
    }

    /**
     * Called when the underlying context is lost.
     *
     * @private
     * @param {WebGLContextEvent} event - The DOM event about the context being lost.
     */
    _onContextLost(event)
    {
        event.preventDefault();
        this.onContextLost.dispatch();
    }

    /**
     * Called when the underlying context is restored.
     *
     * @private
     */
    _onContextRestored()
    {
        this._initContext();
        this.onContextRestored.dispatch();
    }
}

function compareSystemsPriority(a, b)
{
    return b.priority - a.priority;
}
