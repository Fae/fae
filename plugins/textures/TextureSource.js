import Signal from 'mini-signals';
import bitTwiddle from 'bit-twiddle';
import { debug, glutil } from '@fae/core';

/**
 * A TextureSource is a wrapper around a raw object that can be drawn with the
 * WebGL API. It contains information necessary for managing that source.
 *
 * @class
 */
export default class TextureSource
{
    /**
     * @param {CanvasImageSource|RenderTarget} source - The drawable source.
     * @param {number} scaleMode - How to scale the texture source. Either `WebGLRenderingContext.LINEAR`
     *  or `WebGLRenderingContext.NEAREST`.
     * @param {number} wrapMode - How to scale the texture source. Either `WebGLRenderingContext.CLAMP_TO_EDGE`,
     *  `WebGLRenderingContext.REPEAT`, or `WebGLRenderingContext.MIRRORED_REPEAT`.
     * @param {boolean} mipmap - Whether a mipmap should be generated for this texture.
     */
    constructor(
        source,
        scaleMode = TextureSource.defaultScaleMode,
        wrapMode = TextureSource.defaultWrapMode,
        mipmap = TextureSource.defaultMipMap
    )
    {
        /**
         * The width of the source, set when the source has loaded
         *
         * @member {number}
         * @readonly
         */
        this.width = 0;

        /**
         * The height of the source, set when the source has loaded
         *
         * @member {number}
         * @readonly
         */
        this.height = 0;

        /**
         * Set to true once the source has successfully loaded.
         *
         * This is never true if the underlying source fails to load or has no
         * texture data.
         *
         * @member {boolean}
         * @readonly
         */
        this.ready = false;

        /**
         * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
         * Built-in blend modes, and shaders written for default value. Change it on
         * your own risk.
         *
         * @member {boolean}
         * @default true
         */
        this.premultipliedAlpha = true;

        /**
         * Wether or not the texture is a power of two, try to use power of two
         * textures as much as you can.
         *
         * @private
         * @member {boolean}
         */
        this.isPowerOfTwo = false;

        /**
         * The scale mode to apply when scaling this texture
         *
         * Valid values are:
         *
         * - `WebGLRenderingContext.NEAREST`
         * - `WebGLRenderingContext.LINEAR`
         *
         * You can change the default used with {@link TextureSource.defaultScaleMode}.
         *
         * @member {number}
         */
        this.scaleMode = scaleMode;

        /**
         * WebGL Texture wrap mode.
         *
         * Valid values are:
         *
         * - `WebGLRenderingContext.CLAMP_TO_EDGE`
         * - `WebGLRenderingContext.REPEAT`
         * - `WebGLRenderingContext.MIRRORED_REPEAT`
         *
         * You can change the default used with {@link TextureSource.defaultWrapMode}.
         *
         * @member {number}
         */
        this.wrapMode = wrapMode;

        /**
         * Set this to true if a mipmap of this texture needs to be generated. This
         * value needs to be set before the texture is used.
         * Also the texture must be a power of two size to work
         *
         * You can change the default used with {@link TextureSource.defaultMipMap}.
         *
         * @member {boolean}
         */
        this.mipmap = mipmap;

        /**
         * Dispatched when the source has loaded, if the source is already
         * loaded when this object is created, this will be dispatched 1 tick
         * after creation.
         *
         * @member {Signal}
         */
        this.onReady = new Signal();

        /**
         * Dispatched if a source fails to load. This usually only happens
         * for sources that are not yet loaded when this object is created.
         *
         * @member {Signal}
         */
        this.onError = new Signal();

        /**
         * Dispatched when this source is updated.
         *
         * @member {Signal}
         */
        this.onUpdate = new Signal();

        /**
         * The source element to draw.
         *
         * @private
         * @member {CanvasImageSource}
         */
        this._source = null;

        /**
         * The tracker for the video update loop if needed.
         *
         * @private
         * @member {number}
         */
        this._updateLoop = 0;

        /**
         * A map of renderer IDs to GLTexture instances.
         *
         * @member {object<number, WebGLTexture>}
         * @private
         */
        this._glTextures = {};
        this._enabled = 0;
        this._id = 0;

        this._boundOnSourceLoad = this._onSourceLoad.bind(this);
        this._boundOnSourceError = this._onSourceError.bind(this);
        this._boundOnSourcePlay = this._onSourcePlay.bind(this);
        this._boundOnSourceStop = this._onSourceStop.bind(this);
        this._boundVideoUpdateLoop = this._videoUpdateLoop.bind(this);

        // run source setter
        this.source = source;

        // @ifdef DEBUG
        const c = WebGLRenderingContext;
        const s = this.scaleMode;
        const w = this.wrapMode;

        debug.ASSERT(s === c.LINEAR || s === c.NEAREST, `Invalid scaleMode: ${s} (${typeof s}).`);
        debug.ASSERT(w === c.CLAMP_TO_EDGE || w === c.REPEAT || w === c.MIRRORED_REPEAT, `Invalid warpMode: ${w} (${typeof w}).`); // eslint-disable-line max-len
        debug.ASSERT(typeof this.mipmap === 'boolean', `Invalid mipmap value: ${this.mipmap} (${typeof this.mipmap}).`);
        // @endif
    }

    /**
     * The source element to draw.
     *
     * @member {CanvasImageSource}
     */
    get source()
    {
        return this._source;
    }

    /**
     * @param {CanvasImageSource} v - new source.
     */
    set source(v)
    {
        this._load(v);
    }

    /**
     * Updates the texture properties based on the source.
     *
     * @param {Renderer} [renderer] - The renderer to update on. If not passed, all are updated.
     * @param {boolean} silent - Should we skip dispatching the update event?
     * @return {TextureSource} Returns itself.
     */
    update(renderer, silent = false)
    {
        this.width = this.source.naturalWidth || this.source.videoWidth || this.source.width;
        this.height = this.source.naturalHeight || this.source.videoHeight || this.source.height;

        this.isPowerOfTwo = bitTwiddle.isPow2(this.width) && bitTwiddle.isPow2(this.height);

        if (renderer)
        {
            this._update(renderer.uid);
        }
        else
        {
            Object.keys(this._glTextures).forEach((k) => this._update(k));
        }

        if (this.source.currentTime && !this.source.paused && !this.source.ended)
        {
            this._onSourcePlay();
        }

        if (!silent)
        {
            this.onUpdate.dispatch();
        }

        return this;
    }

    /**
     * Disposes of all GLTexture instances and clears them from the GPU for all renderers.
     *
     * @param {Renderer} [renderer] - The renderer to dispose on. If not passed, all are disposed.
     */
    dispose(renderer)
    {
        if (renderer)
        {
            this._dispose(renderer.uid);
        }
        else
        {
            Object.keys(this._glTextures).forEach((k) => this._dispose(k));
        }
    }

    /**
     * Gets the underlying GLTexture instance for a particular renderer, creating
     * one if necessary.
     *
     * @param {Renderer} renderer - The renderer to get a GLTexture for.
     * @return {GLTexture} The GLTexture to use, or `null` if it hasn't loaded yet.
     */
    getGlTexture(renderer)
    {
        if (!this.ready) return null;

        // support for RenderTarget as source.
        if (this.source.framebuffer)
        {
            if (this.source.framebuffer.texture)
            {
                return this.source.framebuffer.texture;
            }

            // @ifdef DEBUG
            debug.ASSERT(false, 'Tried to render a RenderTexture source that has no GLTexture created.');
            // @endif

            return null;
        }

        let glTexture = this._glTextures[renderer.uid];

        if (!glTexture)
        {
            glTexture = new glutil.GLTexture(renderer.gl);
            glTexture.premultiplyAlpha = true;

            this._glTextures[renderer.uid] = glTexture;

            // wrap mode
            if (this.isPowerOfTwo)
            {
                if (this.mipmap)
                {
                    glTexture.enableMipmap();
                }

                if (this.wrapMode === WebGLRenderingContext.CLAMP_TO_EDGE)
                {
                    glTexture.enableWrapClamp();
                }
                else if (this.wrapMode === WebGLRenderingContext.REPEAT)
                {
                    glTexture.enableWrapRepeat();
                }
                else
                {
                    glTexture.enableWrapMirrorRepeat();
                }
            }
            else
            {
                glTexture.enableWrapClamp();
            }

            // scale mode
            if (this.scaleMode === WebGLRenderingContext.NEAREST)
            {
                glTexture.enableNearestScaling();
            }
            else
            {
                glTexture.enableLinearScaling();
            }

            this._update(renderer.uid);
        }

        return glTexture;
    }

    /**
     * Destroys this texture source.
     *
     */
    destroy()
    {
        this.dispose();

        this._unbindSourceEvents();
        this.source = null;

        this.onUpdate.detachAll();
        this.onUpdate = null;

        this.onReady.detachAll();
        this.onReady = null;

        this.onError.detachAll();
        this.onError = null;
    }

    /**
     * Updates an internal texture.
     *
     * @private
     * @param {number} uid - The renderer uid to update for.
     */
    _update(uid)
    {
        const glTexture = this._glTextures[uid];

        if (glTexture)
        {
            glTexture.upload(this.source);
        }
    }

    /**
     * Disposes of an internal texture.
     *
     * @private
     * @param {number} uid - The renderer uid to dispose for.
     */
    _dispose(uid)
    {
        const glTexture = this._glTextures[uid];

        if (glTexture)
        {
            glTexture.destroy();

            delete this._glTextures[uid];
        }
    }

    /**
     * Loads a new source.
     *
     * @private
     * @param {CanvasImageSource} source - The source to load.
     */
    _load(source)
    {
        this.ready = false;
        this._unbindSourceEvents();

        this._source = source;

        if (!source) return;

        // handle RenderTarget
        if (source.framebuffer)
        {
            // @ifdef DEBUG
            debug.ASSERT(source.width && source.height, 'RenderTarget source is missing width or height.');
            // @endif

            this._onSourceLoad();
        }
        // handle canvas
        else if (source.getContext)
        {
            // @ifdef DEBUG
            debug.ASSERT(source.width && source.height, 'Canvas source is missing width or height.');
            // @endif

            this._onSourceLoad();
        }
        else
        {
            this._bindSourceEvents();

            // handle image
            if (typeof source.src === 'string')
            {
                // complete is marked as true if the src is empty, so need to check both.
                // if `src` is empty, we assume they will assign one later, and our events will catch it.
                if (source.complete && source.src)
                {
                    this._onSourceLoad();
                }
            }
            // handle video
            else if (source.complete)
            {
                this._onSourceLoad();
            }
        }
    }

    /**
     * Called when the underlying source is loaded and ready to be used.
     *
     * @private
     */
    _onSourceLoad()
    {
        // if we have no width/height, consider the load a failure.
        this.update(null, true);
        if (!this.width || !this.height)
        {
            this._onSourceError({ message: 'Source failed to load.' });

            return;
        }

        // unbind events related to loading, but keep non-loading related ones.
        this._unbindSourceEvents(true);

        // update
        this.ready = true;
        this.update();

        // since _onSourceLoad can be called synchronously, wait a tick before dispatching.
        setTimeout(() => this.onReady.dispatch(), 0);
    }

    /**
     * Called if the underlying source has an error during loading.
     *
     * @private
     * @param {object} event - The error event.
     */
    _onSourceError(event)
    {
        this._unbindSourceEvents();

        // since _onSourceError can be called synchronously, wait a tick before dispatching.
        setTimeout(() => this.onError.dispatch(new Error(event.message || 'Unable to load source.')), 0);
    }

    /**
     * Runs the update loop when the video is ready to play
     *
     * @private
     */
    _onSourcePlay()
    {
        cancelAnimationFrame(this._updateLoop);
        this._videoUpdateLoop();
    }

    /**
     * Stops the update loop when the video is paused
     *
     * @private
     */
    _onSourceStop()
    {
        cancelAnimationFrame(this._updateLoop);
    }

    /**
     * Updates the texture for the video element.
     *
     * @private
     */
    _videoUpdateLoop()
    {
        this._updateLoop = requestAnimationFrame(this._boundVideoUpdateLoop);
        this.update(null, true);
    }

    /**
     * Binds listeners to a source image or video.
     *
     * @private
     * @param {boolean} loadOnly - Only manage events related to loading.
     */
    _bindSourceEvents(loadOnly = false)
    {
        if (!this._source) return;

        this._source.addEventListener('load', this._boundOnSourceLoad);
        this._source.addEventListener('canplay', this._boundOnSourceLoad);
        this._source.addEventListener('canplaythrough', this._boundOnSourceLoad);
        this._source.addEventListener('error', this._boundOnSourceError);

        if (!loadOnly)
        {
            this._source.addEventListener('play', this._boundOnSourcePlay);
            this._source.addEventListener('pause', this._boundOnSourceStop);
        }
    }

    /**
     * Unbinds listeners from a source image or video.
     *
     * @private
     * @param {boolean} loadOnly - Only manage events related to loading.
     */
    _unbindSourceEvents(loadOnly = false)
    {
        if (!this._source) return;

        this._source.removeEventListener('load', this._boundOnSourceLoad);
        this._source.removeEventListener('canplay', this._boundOnSourceLoad);
        this._source.removeEventListener('canplaythrough', this._boundOnSourceLoad);
        this._source.removeEventListener('error', this._boundOnSourceError);

        if (!loadOnly)
        {
            this._source.removeEventListener('play', this._boundOnSourcePlay);
            this._source.removeEventListener('pause', this._boundOnSourceStop);
        }
    }
}

/**
 * The default scale mode to use when a new source is created, and no
 * scale mode is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {number}
 * @default WebGLRenderingContext.LINEAR
 */
TextureSource.defaultScaleMode = WebGLRenderingContext.LINEAR;

/**
 * The default mipmap mode to use when a new source is created, and no
 * mipmap mode is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {boolean}
 * @default true
 */
TextureSource.defaultMipMap = true;

/**
 * The default wrapping mode to use when a new source is created, and no
 * wrapping mode is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {number}
 * @default WebGLRenderingContext.CLAMP_TO_EDGE
 */
TextureSource.defaultWrapMode = WebGLRenderingContext.CLAMP_TO_EDGE;

/**
 * An empty texture source instance.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {TextureSource}
 */
TextureSource.EMPTY = new TextureSource();
TextureSource.EMPTY.destroy = function _noop() { /* empty */ }; // eslint-disable-line brace-style
