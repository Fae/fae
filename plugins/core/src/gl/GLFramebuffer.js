import GLTexture from './GLTexture';

/**
 * Helper class to create a WebGL framebuffer.
 *
 * Generally you do not want to create this class directly, but instead
 * use the static {@link GLFramebuffer#createRGBA} and {@link GLFramebuffer#createFloat32}
 *
 * @class
 * @memberof glutil
 */
export default class GLFramebuffer
{
    /**
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {number} width - the width of the drawing area of the frame buffer
     * @param {number} height - the height of the drawing area of the frame buffer
     */
    constructor(gl, width = 100, height = 100)
    {
        /**
         * The current WebGL rendering context.
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The frame buffer.
         *
         * @member {WebGLFramebuffer}
         */
        this.framebuffer = gl.createFramebuffer();

        /**
         * The stencil buffer.
         *
         * @member {WebGLRenderbuffer}
         */
        this.stencil = null;

        /**
         * The stencil buffer.
         *
         * @member {GLTexture}
         */
        this.texture = null;

        /**
         * The width of the drawing area of the buffer.
         *
         * @member {number}
         */
        this.width = width;

        /**
         * The height of the drawing area of the buffer.
         *
         * @member {number}
         */
        this.height = height;
    }

    /**
     * Creates a frame buffer with a texture containing the given data
     *
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {number} width - the width of the drawing area of the frame buffer
     * @param {number} height - the height of the drawing area of the frame buffer
     * @return {GLFramebuffer} The new framebuffer.
     */
    static createRGBA(gl, width, height)
    {
        return GLFramebuffer.createFloat32(gl, width, height, null);
    }

    /**
     * Creates a frame buffer with a texture containing the given data
     *
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {number} width - the width of the drawing area of the frame buffer
     * @param {number} height - the height of the drawing area of the frame buffer
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data
     * @return {GLFramebuffer} The new framebuffer.
     */
    static createFloat32(gl, width, height, data)
    {
        const texture = GLTexture.fromData(gl, data, width, height);

        texture.enableNearestScaling();
        texture.enableWrapClamp();

        // now create the framebuffer object and attach the texture to it.
        const fbo = new GLFramebuffer(gl, width, height);

        fbo.enableTexture(texture);
        fbo.unbind();

        return fbo;
    }

    /**
     * Adds a texture to the framebuffer.
     *
     * @param {GLTexture} texture - the texture to add.
     */
    enableTexture(texture)
    {
        const gl = this.gl;

        this.texture = texture || new GLTexture(gl);

        this.texture.bind();

        this.bind();

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
    }

    /**
     * Initialises the stencil buffer
     */
    enableStencil()
    {
        if (this.stencil) return;

        const gl = this.gl;

        this.stencil = gl.createRenderbuffer();

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);

        // TODO.. this is depth AND stencil?
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
    }

    /**
     * Erases the drawing area and fills it with a colour
     *
     * @param {number} r - the red value of the clearing colour
     * @param {number} g - the green value of the clearing colour
     * @param {number} b - the blue value of the clearing colour
     * @param {number} a - the alpha value of the clearing colour
     */
    clear(r = 0, g = 0, b = 0, a = 1)
    {
        this.bind();

        const gl = this.gl;

        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Binds the frame buffer to the WebGL context
     */
    bind()
    {
        const gl = this.gl;

        if (this.texture)
        {
            this.texture.unbind();
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    }

    /**
     * Unbinds the frame buffer to the WebGL context
     */
    unbind()
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    /**
     * Resizes the drawing area of the buffer to the given width and height
     *
     * @param {number} width - the new width
     * @param {number} height - the new height
     */
    resize(width, height)
    {
        const gl = this.gl;

        this.width = width;
        this.height = height;

        if (this.texture)
        {
            this.texture.uploadData(null, width, height);
        }

        if (this.stencil)
        {
            // update the stencil buffer width and height
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
        }
    }

    /**
     * Destroys this buffer
     */
    destroy()
    {
        if (this.texture)
        {
            this.texture.destroy();
        }

        this.gl.deleteFramebuffer(this.framebuffer);

        this.gl = null;
        this.framebuffer = null;
        this.stencil = null;
        this.texture = null;
    }
}
