'use strict';

export default class RenderTarget {

    /**
     * Creates a new render target.
     *
     * @param {!WebGLContext} gl - The WebGL context to draw with.
     * @param {boolean} root - Whether this is the root render target or not.
     */
    constructor(gl, root = false)
    {
        this.gl = gl;
        this.root = root;

        this.framebuffer = null;
        this.texture = null;

        this.size = vec2.create();
        this.projectionMatrix = mat4.create();

        if (root)
        {
            this.framebuffer = gl.createFramebuffer();
            this.texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D,  this.texture);

            // set the scale properties of the texture..
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

            // // check to see if the texture is a power of two!
            // var isPowerOfTwo = utils.isPowerOfTwo(width, height);

            // // TODO: for 99% of use cases if a texture is power of two we should tile the texture...
            // // TODO: This should be configurable, and default to this logic instead of always using this logic.
            // if (!isPowerOfTwo)
            // {
            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // }
            // else
            // {

            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            // }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        }
    }

    /**
     * Clears the target with a single color. Usually called each from to clear the buffer.
     * If you pass an array it must be in the format: `[red, green, blue, alpha]`.
     *
     * @param {Color|Array.<number>|Float32Array} [color=Color.Black] - The color to clear with.
     */
    clear(color = Color.BLACK)
    {
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Draws a drawable object to the
     *
     * @param {!Drawable} drawable - The drawable object to draw.
     * @param {RenderStates} [states=RenderStates.default] - The render states to draw with.
     */
    draw(drawable, states = RenderStates.default)
    {
        drawable.draw(this, states);
    }

    /**
     * Draws a drawable object to the
     *
     * @param {!(Array.<number>|Float32Array)} vertices - An array of vertices to draw.
     * @param {!WebGLDrawType} type - The draw type (gl.TRIANGLES, etc).
     * @param {RenderStates} [states=RenderStates.default] - The render states to draw with.
     */
    draw(vertices, type, states = RendererStates.default)
    {
        if (!verticies || !vertices.length)
            return;

        // activate framebuffer and set viewport
        this.activate();

        // TODO: draw verts
    }

    activate()
    {
        this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        this._updateProjection(this.size);

        gl.viewport(0, 0, this.size[0], this.size[1]);
    }

    resize(width, height)
    {
        this.size[0] = width;
        this.size[1] = height;

        this._updateProjection();

        if (!this.root)
        {
            this.gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
    }

    destroy()
    {
        // this.gl.deleteRenderbuffer(this.stencilBuffer);
        this.gl.deleteFramebuffer(this.frameBuffer);
        this.gl.deleteTexture(this.texture);

        this.frameBuffer = null;
        this.texture = null;
    }

    _updateProjection()
    {
        let pm = this.projectionMatrix;
        let size = this.size;

        mat4.identity(pm);

        if (!this.root)
        {
            pm[0] = 1 / (size[0] * 2);
            pm[5] = 1 / (size[1] * 2);

            pm[2] = -1; // - projectionFrame.x * pm[0];
            pm[6] = -1; // - projectionFrame.y * pm[5];
        }
        else
        {
            pm[0] = 1 / size[0] * 2;
            pm[5] = -1 / size[1] * 2;

            pm[2] = -1; // - projectionFrame.x * pm.a;
            pm[6] = 1; // - projectionFrame.y * pm.d;
        }
    }

    _applyTexture(states)
    {
        let gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D,  states.texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        // if (!isPowerOfTwo)
        // {
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // }
        // else
        // {

        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

}
