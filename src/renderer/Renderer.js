import RenderTarget from './RenderTarget.js';
import RenderState from './RenderState.js';

/**
 * @class
 */
export default class Renderer
{
    /**
     * Creates a new renderer.
     *
     * @param {!(HTMLCanvasElement|WebGLRenderingContext)} context - The canvas to create a context from,
     *  or the context to use to draw.
     */
    constructor(context)
    {
        const gl = this.gl = (context.nodeName ? context.getContext('webgl') : context);

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        this.screen = new RenderTarget(gl, this.gl.canvas.width, this.gl.canvas.height, true);
        this.state = new RenderState();
    }

    /**
     * Renders a drawable object to the render target.
     *
     * @param {!SceneObject} drawable - The drawable object to draw.
     * @param {RenderTarget} target - The target to render to, defaults to the screen.
     */
    render(drawable, target = this.screen)
    {
        this.state.reset();
        drawable.render(target, this.state);
    }
}
