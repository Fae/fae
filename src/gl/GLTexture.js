// @ifdef DEBUG
import { ASSERT } from '../debug';

let FLOATING_POINT_AVAILABLE = false;
// @endif

/**
 * Helper class to create a WebGL texture.
 *
 * @class
 */
export default class GLTexture
{
    /**
     * @param {!WebGLRenderingContext} gl - The current WebGL context.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {number} format - The pixel format of the texture.
     * @param {number} type - The gl type of the texture.
     */
    constructor(gl, width = 0, height = 0, format = gl.RGBA, type = gl.UNSIGNED_BYTE)
    {
        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The WebGL texture
         *
         * @member {WebGLTexture}
         */
        this.texture = gl.createTexture();

        /**
         * If mipmapping was used for this texture, enable and disable with enableMipmap()
         *
         * @member {boolean}
         */
        this.mipmap = false;

        /**
         * Set to true to enable pre-multiplied alpha
         *
         * @member {boolean}
         */
        this.premultiplyAlpha = false;

        /**
         * The width of texture
         *
         * @member {number}
         */
        this.width = width;

        /**
         * The height of texture
         *
         * @member {number}
         */
        this.height = height;

        /**
         * The pixel format of the texture. defaults to gl.RGBA
         *
         * @member {number}
         */
        this.format = format;

        /**
         * The gl type of the texture. defaults to gl.UNSIGNED_BYTE
         *
         * @member {number}
         */
        this.type = type;
    }

    /**
     * @static
     * @param {!WebGLRenderingContext} gl - The current WebGL context
     * @param {HTMLImageElement|ImageData} source - the source image of the texture
     * @param {boolean} premultiplyAlpha - If we want to use pre-multiplied alpha
     * @return {GLTexture} The new texture.
     */
    static fromSource(gl, source, premultiplyAlpha = false)
    {
        const texture = new GLTexture(gl);

        texture.premultiplyAlpha = premultiplyAlpha;
        texture.upload(source);

        return texture;
    }

    /**
     * @static
     * @param {!WebGLRenderingContext} gl - The current WebGL context
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - the data to upload to the texture
     * @param {number} width - the new width of the texture
     * @param {number} height - the new height of the texture
     * @return {GLTexture} The new texture.
     */
    static fromData(gl, data, width, height)
    {
        const texture = new GLTexture(gl);

        texture.uploadData(data, width, height);

        return texture;
    }

    /**
     * Uploads this texture to the GPU
     *
     * @param {HTMLImageElement|ImageData|HTMLVideoElement} source - the source image of the texture
     */
    upload(source)
    {
        this.bind();

        // if the source is a video, we need to use the videoWidth / videoHeight as width / height will be incorrect.
        this.width = source.videoWidth || source.width;
        this.height = source.videoHeight || source.height;

        const gl = this.gl;

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source);
    }

    /**
     * Use a data source and uploads this texture to the GPU
     *
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - the data to upload to the texture
     * @param {number} width - the new width of the texture
     * @param {number} height - the new height of the texture
     */
    uploadData(data, width, height)
    {
        this.bind();

        const gl = this.gl;

        this.width = width || this.width;
        this.height = height || this.height;

        if (data instanceof Float32Array)
        {
            // @ifdef DEBUG
            if (!FLOATING_POINT_AVAILABLE)
            {
                const ext = gl.getExtension('OES_texture_float');

                ASSERT(ext, 'GLTexture#uploadData: floating point textures not available.');

                FLOATING_POINT_AVAILABLE = !!ext;
            }
            // @endif

            this.type = gl.FLOAT;
        }
        else
        {
            // TODO support for other types
            this.type = gl.UNSIGNED_BYTE;
        }

        // what type of data?
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, data || null);
    }

    /**
     * Binds the texture
     *
     * @param {number} location - The texture slot to fill.
     */
    bind(location = -1)
    {
        const gl = this.gl;

        if (location > -1)
        {
            gl.activeTexture(gl.TEXTURE0 + location);
        }

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    /**
     * Unbinds the texture
     */
    unbind()
    {
        const gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * @param {boolean} linear - if we want to use linear filtering or nearest neighbour interpolation
     */
    minFilter(linear)
    {
        const gl = this.gl;

        this.bind();

        if (this.mipmap)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST); // eslint-disable-line max-len
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
        }
    }

    /**
     * @param {boolean} linear - if we want to use linear filtering or nearest neighbour interpolation
     */
    magFilter(linear)
    {
        const gl = this.gl;

        this.bind();

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
    }

    /**
     * Enables mipmapping
     */
    enableMipmap()
    {
        const gl = this.gl;

        this.bind();

        this.mipmap = true;

        gl.generateMipmap(gl.TEXTURE_2D);
    }

    /**
     * Enables linear filtering
     */
    enableLinearScaling()
    {
        this.minFilter(true);
        this.magFilter(true);
    }

    /**
     * Enables nearest neighbour interpolation
     */
    enableNearestScaling()
    {
        this.minFilter(false);
        this.magFilter(false);
    }

    /**
     * Enables clamping on the texture so WebGL will not repeat it
     */
    enableWrapClamp()
    {
        const gl = this.gl;

        this.bind();

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    /**
     * Enable tiling on the texture
     */
    enableWrapRepeat()
    {
        const gl = this.gl;

        this.bind();

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }

    /**
     * Enable wrapping on the texture
     */
    enableWrapMirrorRepeat()
    {
        const gl = this.gl;

        this.bind();

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    }

    /**
     * Destroys this texture
     */
    destroy()
    {
        this.gl.deleteTexture(this.texture);

        this.gl = null;
        this.texture = null;
    }
}
