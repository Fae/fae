import Signal from 'mini-signals';
import ECS from '@fae/ecs';
import GLContext from '../gl/GLContext';
import GLProgramCache from '../gl/GLProgramCache';
import RenderTarget from './RenderTarget';
import RenderState from './RenderState';
import ObjectRenderer from './ObjectRenderer';
import { uid, removeElements } from '../util';

const defaultSystems = [];

/**
 * The Renderer is just a container for the WebGLRenderingContext, the render state,
 * and the current object renderer that is doing the rendering.
 *
 * @class
 * @memberof render
 */
export default class Renderer extends ECS
{
    /**
     * Creates a new renderer.
     *
     * @param {HTMLCanvasElement|WebGLRenderingContext} context - The canvas to create a context from,
     *  or the context to use to draw.
     * @param {object} options - Options for the renderer.
     * @param {boolean} options.clearBeforeRender=true - Should we clear before each render?
     * @param {boolean} options.preserveDrawingBuffer=false - Enables drawing buffer preservation,
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
         * An empty renderer.
         *
         * @member {ObjectRenderer}
         */
        this.emptyRenderer = new ObjectRenderer(this);

        /**
         * The currently active object renderer.
         *
         * @member {ObjectRenderer}
         */
        this.activeObjectRenderer = this.emptyRenderer;

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

        this.gl.canvas.addEventListener('webglcontextlost', this._boundOnContextLost, false);
        this.gl.canvas.addEventListener('webglcontextrestored', this._boundOnContextRestored, false);

        // initialize for a new context
        this._initContext();

        // create and add the default systems
        for (let i = 0; i < defaultSystems.length; ++i)
        {
            const system = new defaultSystems[i](this);

            this.addSystem(system);
        }
    }

    /**
     * Adds a system that will be created automatically when a renderer instance is created.
     *
     * Note: Calling this function registers a system to be automatically added in renderers
     * that you create *after* calling this. If you call this after creating a renderer, the
     * already created renderer will *not* contain this system automatically.
     *
     * @param {System} System - The system class to add (**not** an instance, but the class
     * itself)
     */
    static addDefaultSystem(System)
    {
        defaultSystems.push(System);
    }

    /**
     * Removes a system so that it will no longer be created automatically when a renderer
     * instance is created.
     *
     * Note: Calling this function unregisters a system to be automatically added in renderers
     * that you create *after* calling this. If you call this after creating a renderer, the
     * already created renderer may contain this system automatically.
     *
     * @param {System} System - The system class to add (**not** an instance, but the class
     * itself)
     */
    static removeDefaultSystem(System)
    {
        const idx = defaultSystems.indexOf(System);

        if (idx !== -1)
        {
            removeElements(defaultSystems, idx, 1);
        }
    }

    /**
     * Add a system to the renderer.
     *
     * @param {System} system - The system to add.
     * @param {boolean} skipSort - If true, will not sort the systems automatically.
     *  Setting this to true requires you call {@link Renderer#sortSystems} manually. This
     *  can be useful if you are adding a large batch of systems in a single frame and want
     *  to delay the sorting until after they are all added.
     */
    addSystem(system, skipSort = false)
    {
        super.addSystem(system);

        if (!skipSort) this.sortSystems();
    }

    /**
     * Add an entity to the renderer.
     *
     * Note: Since adding an entity causes the entity list to be sorted (to ensure renderPriority
     * and grouping is correct), this method can be expensive when you have a large list. As such
     * it is recommended not to Add/Remove entities many times per frame.
     *
     * @param {Entity} entity - The entity to add.
     * @param {boolean} skipSort - If true, will not sort the entities automatically.
     *  Setting this to true requires you call {@link Renderer#sortEntities} manually. This
     *  can be useful if you are adding a large batch of entities in a single frame and want
     *  to delay the sorting until after they are all added.
     */
    addEntity(entity, skipSort)
    {
        super.addEntity(entity);

        if (!skipSort) this.sortEntities();
    }

    /**
     * Sorts the systems by priority. If you change a system's priority after adding
     * it to the renderer then you will need to call this for it to be properly sorted.
     *
     */
    sortSystems()
    {
        this.systems.sort(compareSystemsPriority);
    }

    /**
     * Sorts the entities by render priority and their group hint. If you change an
     * entity's priority after adding it to the renderer then you will need to call
     * this for it to take effect.
     *
     */
    sortEntities()
    {
        this.entities.sort(compareRenderPriority);
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

        // start the active object renderer
        this.activeObjectRenderer.start();

        // clear if we should
        if (clear) this.state.target.clear();

        // process all the entites and their systems
        this.update();

        // stop the active object renderer
        this.activeObjectRenderer.stop();

        // tell everyone we updated
        this.onAfterRender.dispatch();
    }

    /**
     * Sets the passed ObjectRenderer instance as the active object renderer.
     *
     * @param {ObjectRenderer} objectRenderer - The object renderer to use.
     */
    setActiveObjectRenderer(objectRenderer)
    {
        if (this.activeObjectRenderer !== objectRenderer)
        {
            this.activeObjectRenderer.stop();
            this.activeObjectRenderer = objectRenderer;
            this.activeObjectRenderer.start();
        }
    }

    /**
     * Destroys this renderer and the related objects.
     *
     */
    destroy()
    {
        // unbind canvas events
        this.gl.canvas.removeEventListener('webglcontextlost', this._boundOnContextLost, false);
        this.gl.canvas.removeEventListener('webglcontextrestored', this._boundOnContextRestored, false);

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

        this.activeObjectRenderer = null;

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

        this.onContextChange.dispatch(this);
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
        this.onContextLost.dispatch(this);
    }

    /**
     * Called when the underlying context is restored.
     *
     * @private
     */
    _onContextRestored()
    {
        GLProgramCache.clear();
        this._initContext();
        this.onContextRestored.dispatch(this);
    }
}

// lower is placed first
function compareSystemsPriority(a, b)
{
    return a.priority - b.priority;
}

// lower is placed first, and within renderPriority they are grouped
// by the renderGroupHint
function compareRenderPriority(a, b)
{
    if (a.renderPriority === b.renderPriority)
    {
        return a.renderGroupHint === b.renderGroupHint ? 0 : 1;
    }

    return a.renderPriority - b.renderPriority;
}
