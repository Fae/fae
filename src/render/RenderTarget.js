import GLFramebuffer from '../gl/GLFramebuffer';
import Vector2d from '../math/Vector2d';
import Matrix2d from '../math/Matrix2d';
import Rectangle from '../math/Rectangle';
import Color from '../util/Color';

/**
 * A RenderTarget is a wrapper around framebuffer to be rendered to.
 *
 * @class
 */
export default class RenderTarget
{
    /**
     * Creates a new render target.
     *
     * @param {!WebGLContext} gl - The WebGL context to draw with.
     * @param {!number} width - The width of the target.
     * @param {!number} height - The height of the target.
     * @param {number} scaleMode - The mode to scale by.
     * @param {boolean} root - Whether this is the root render target or not.
     */
    constructor(gl, width, height, scaleMode = RenderTarget.defaultScaleMode, root = false)
    {
        this.gl = gl;
        this.root = root;

        this.framebuffer = null;

        this.clearColor = Color.BLACK.clone();

        this.size = new Vector2d();

        this.projectionMatrix = new Matrix2d();

        this.transform = null;

        this.scaleMode = scaleMode;

        this.defaultFrame = new Rectangle();
        this.destinationFrame = null;
        this.sourceFrame = null;

        if (!root)
        {
            this.framebuffer = GLFramebuffer.createRGBA(gl, 100, 100);

            if (this.scaleMode === WebGLRenderingContext.NEAREST)
            {
                this.framebuffer.texture.enableNearestScaling();
            }
            else
            {
                this.framebuffer.texture.enableLinearScaling();
            }
        }
        else
        {
            this.framebuffer = new GLFramebuffer(gl, 100, 100);
            this.framebuffer.framebuffer = null;
        }

        this.setFrame();
        this.resize(width, height);
    }

    /**
     * The width of this render target. Proxy for `.size.x`.
     *
     * To set this, call `.resize(width, height)`
     *
     * @member {number}
     */
    get width()
    {
        return this.size.x;
    }

    /**
     * The width of this render target. Proxy for `.size.x`.
     *
     * To set this, call `.resize(width, height)`
     *
     * @member {number}
     */
    get height()
    {
        return this.size.y;
    }

    /**
     * Clears the target with a single color. Usually called each from to clear the buffer.
     * If you pass an array it must be in the format: `[red, green, blue, alpha]`.
     *
     * @param {Color|number[]|Float32Array} color - The color to clear with.
     */
    clear(color = this.clearColor)
    {
        this.framebuffer.clear(color.r, color.g, color.b, color.a);
    }

    /**
     * Sets the frame of the render target.
     *
     * @param {Rectangle} destinationFrame - The destination frame.
     * @param {Rectangle} sourceFrame - The source frame.
     */
    setFrame(destinationFrame = null, sourceFrame = null)
    {
        this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
        this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
    }

    /**
     * Binds the buffers and initialises the viewport.
     *
     */
    activate()
    {
        const gl = this.gl;

        this.framebuffer.bind();

        this.calculateProjection(this.destinationFrame, this.sourceFrame);

        if (this.transform)
        {
            this.projectionMatrix.multiply(this.transform);
        }

        if (this.destinationFrame.equals(this.sourceFrame))
        {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(
                this.destinationFrame.x | 0,
                this.destinationFrame.y | 0,
                (this.destinationFrame.width/* * this.resolution*/) | 0,
                (this.destinationFrame.height/* * this.resolution*/) | 0
            );
        }
        else
        {
            gl.disable(gl.SCISSOR_TEST);
        }

        // set viewport to this target
        gl.viewport(
            this.destinationFrame.x | 0,
            this.destinationFrame.y | 0,
            (this.destinationFrame.width/* * this.resolution*/) | 0,
            (this.destinationFrame.height/* * this.resolution*/) | 0
        );
    }

    /**
     * Updates the projection matrix based on the projection frame.
     *
     * @param {Rectangle} destinationFrame - The destination frame.
     * @param {Rectangle} sourceFrame - The source frame.
     */
    calculateProjection(destinationFrame, sourceFrame = null)
    {
        const pm = this.projectionMatrix;

        sourceFrame = sourceFrame || destinationFrame;

        pm.identity();

        if (!this.root)
        {
            pm.a = 1 / destinationFrame.width * 2;
            pm.d = 1 / destinationFrame.height * 2;

            pm.tx = -1 - (sourceFrame.x * pm.a);
            pm.ty = -1 - (sourceFrame.y * pm.d);
        }
        else
        {
            pm.a = 1 / destinationFrame.width * 2;
            pm.d = -1 / destinationFrame.height * 2;

            pm.tx = -1 - (sourceFrame.x * pm.a);
            pm.ty = 1 - (sourceFrame.y * pm.d);
        }
    }

    /**
     * Resizes the texture to the specified width and height.
     *
     * @param {number} width - the new width of the texture.
     * @param {number} height - the new height of the texture.
     */
    resize(width, height)
    {
        width = Math.floor(width);
        height = Math.floor(height);

        if (this.size.width === width && this.size.height === height)
        {
            return;
        }

        this.size.width = width;
        this.size.height = height;

        this.defaultFrame.width = width;
        this.defaultFrame.height = height;

        this.framebuffer.resize(width/* * this.resolution*/, height/* * this.resolution*/);

        const projectionFrame = this.size;

        this.calculateProjection(projectionFrame);
    }

    /**
     * Destroys the render target.
     *
     */
    destroy()
    {
        this.framebuffer.destroy();

        this.gl = null;
        this.framebuffer = null;
        this.clearColor = null;
        this.size = null;
        this.projectionMatrix = null;
        this.transform = null;
        this.defaultFrame = null;
        this.destinationFrame = null;
        this.sourceFrame = null;
    }
}

/**
 * The default scale mode for a render target.
 *
 * @static
 * @constant
 * @memberof RenderTarget
 * @type {number}
 * @default WebGLRenderingContext.LINEAR
 */
RenderTarget.defaultScaleMode = WebGLRenderingContext.LINEAR;
