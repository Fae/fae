import RenderTarget from './RenderTarget.js';
import RenderState from './RenderState.js';

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
        let gl = this.gl = (context.nodeName ? context.getContext('webgl') : context);

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        this.screen = new RenderTarget(gl, this.gl.canvas.width, this.gl.canvas.height, true);
        this.state = new RenderState();
    }

    /**
     * Draws a drawable object to the render target.
     *
     * @param {!Drawable} drawable - The drawable object to draw.
     * @param {RenderTarget} [target] - The target to render to, defaults to the screen.
     */
    draw(drawable, target = this.screen)
    {
        this.state.reset();
        drawable.draw(target, this.state);
    }

    /**
     * Creates and returns a WebGLTexture from some source.
     *
     * @param {Image} source - the source image.
     * @returns {WebGLTexture} - the webgl ready texture.
     */
    createTexture(source)
    {
        let gl = this.gl;
        let tx = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        return tx;
    }
}
