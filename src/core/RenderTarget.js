import { vec2, mat4 } from 'gl-matrix';
import Consts from './Consts.js';

/**
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
     * @param {boolean} root - Whether this is the root render target or not.
     */
    constructor(gl, width, height, root = false)
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

            gl.bindTexture(gl.TEXTURE_2D, this.texture);

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

        this.resize(width, height);
    }

    /**
     * Clears the target with a single color. Usually called each from to clear the buffer.
     * If you pass an array it must be in the format: `[red, green, blue, alpha]`.
     *
     * @param {Color|Array.<number>|Float32Array} [color=Color.Black] - The color to clear with.
     */
    clear(color = Consts.BLACK)
    {
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    /**
     * Draws vertices to the buffer via a shader.
     *
     * @param {!(Array.<number>|ArrayBuffer)} vertices - An array of vertices to draw.
     * @param {!(Array.<number>|Uint16Array)} indices - An array of indices into the vertex array.
     * @param {!number} type - The WebGL draw type to use, e.g. Consts.DRAW_TYPE.TRIANGLES.
     * @param {!RenderState} state - The render state to draw with.
     */
    draw(vertices, indices, type, state)
    {
        if (!vertices || !vertices.length) return;

        // activate framebuffer and set viewport
        this.activate();

        const gl = this.gl;

        // upload the index data
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        // bind texture
        gl.bindTexture(gl.TEXDTURE_2D, state.texture);
    }

    /**
     *
     */
    activate()
    {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        this._updateProjection(this.size);

        gl.viewport(0, 0, this.size[0], this.size[1]);
    }

    /**
     * @param {number} width - The width to resize to.
     * @param {number} height - The height to resize to.
     */
    resize(width, height)
    {
        this.size[0] = width;
        this.size[1] = height;

        this._updateProjection();

        if (!this.root)
        {
            const gl = this.gl;

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
    }

    /**
     *
     */
    destroy()
    {
        // this.gl.deleteRenderbuffer(this.stencilBuffer);
        this.gl.deleteFramebuffer(this.frameBuffer);
        this.gl.deleteTexture(this.texture);

        this.frameBuffer = null;
        this.texture = null;
    }

    /**
     *
     */
    _updateProjection()
    {
        const pm = this.projectionMatrix;
        const size = this.size;

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

    /**
     * @param {RenderState} state - The render state to apply to.
     */
    _applyTexture(state)
    {
        const gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, state.texture);

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
