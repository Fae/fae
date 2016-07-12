import Signal from 'mini-signals';
import { math/* @ifdef DEBUG */, debug/* @endif */ } from '@fay/core';
import TextureSource from './TextureSource';
import TextureUVs from './TextureUVs';

/**
 * A Texture is a wrapper around a TextureSource. It represents the frame of the
 * source to actually draw.
 *
 * @class
 */
export default class Texture
{
    /**
     * @param {!TextureSource|CanvasImageSource|Texture} source - The source to wrap.
     * @param {Rectangle} [frame] - The portion of the source to operate with.
     * @param {Rectangle} [orig] - The original area of this frame, before it was put in an atlas (if it was).
     * @param {Rectangle} [trim] - The trimmed area of this frame, after it was put in an atlas (if it was).
     * @param {number} rotation - The rotation of the frame (in radians), after it was put in an atlas (if it was).
     *  This rotation is counteracted to draw an "unrotated" version of the frame.
     */
    constructor(source, frame, orig, trim, rotation = 0)
    {
        // massage source into a TextureSource instance.
        if (source instanceof Texture)
        {
            source = source.source;
        }
        else if (!(source instanceof TextureSource))
        {
            source = new TextureSource(source);
        }

        // @ifdef DEBUG
        debug.ASSERT(source instanceof TextureSource, 'Source passed to Texture is not a TextureSource.');
        // @endif

        /**
         * The source for this texture to represent.
         *
         * @member {TextureSource}
         */
        this.source = source;

        /**
         * The trimmed area of the frame after it was packed into an atlas (if it was).
         *
         * @member {Rectangle}
         */
        this.trim = trim;

        /**
         * The original area of the frame before it was packed into an atlas (if it was).
         *
         * @member {Rectangle}
         */
        this.orig = orig || frame;

        /**
         * Dispatched when the texture is updated.
         *
         * @member {Signal}
         */
        this.onUpdate = new Signal();

        /**
         * Does this texture have an explicit frame, or do we use the whole image?
         *
         * @private
         * @member {boolean}
         */
        this._explicitFrame = !!frame;

        /**
         * The frame of the source to represent.
         *
         * @private
         * @member {Rectangle}
         */
        this._frame = null;

        /**
         * The uvs to draw with.
         *
         * @member {UVs}
         */
        this._uvs = new TextureUVs();

        /**
         * The rotation of the texture, after it was packed into an atlas (if it was).
         *
         * @member {number}
         */
        this._rotation = rotation === true ? -Math.PI / 2 : rotation;

        this._onSourceUpdateBinding = null;
        this._onSourceReadyBinding = null;

        // setup frame
        if (source.ready)
        {
            if (!this._explicitFrame)
            {
                frame = new math.Rectangle(0, 0, source.width, source.height);

                this._onSourceUpdateBinding = source.onUpdate.add(this._onSourceUpdate, this);
            }

            this.frame = frame;
        }
        else
        {
            this._onSourceReadyBinding = source.onReady.once(this._onSourceReady, this);
        }
    }

    /**
     * Is the source loaded and ready to go?
     *
     * @member {boolean}
     */
    get ready()
    {
        return !!((this.source ? this.source.ready : false) && this.orig);
    }

    /**
     * The frame of the source to represent.
     *
     * @member {Rectangle}
     */
    get frame()
    {
        return this._frame;
    }

    /**
     * @param {Rectangle} v - The new frame.
     */
    set frame(v)
    {
        this._frame = v;
        this._explicitFrame = true;

        // @ifdef DEBUG
        debug.ASSERT(
            v.x >= 0 && v.y >= 0 && v.x + v.width <= this.source.width && v.y + v.height <= this.source.height,
            'Frame for texture doesn\'t fit within the source size'
        );
        // @endif

        if (!this.trim && !this.rotate)
        {
            this.orig = v;
        }

        this._updateUVs();
    }

    /**
     * The rotation of the texture frame, after it was packed into an atlas (if it was).
     *
     * @member {number}
     */
    get rotation()
    {
        return this._rotation;
    }

    /**
     * @param {number} v - The rotation in radians.
     */
    set rotation(v)
    {
        this._rotation = v;
        this._updateUVs();
    }

    /**
     * Width of the texture in pixels.
     *
     */
    get width()
    {
        return this.orig ? this.orig.width : 0;
    }

    /**
     * Height of the texture in pixels.
     *
     */
    get height()
    {
        return this.orig ? this.orig.height : 0;
    }

    /**
     * Updates the texture on the GPU.
     *
     * @return {Texture} Returns itself.
     */
    update()
    {
        this.source.update();

        return this;
    }

    /**
     * Creates a new texture that represents the same region as this one.
     *
     * @return {Texture} The clone.
     */
    clone()
    {
        return new Texture(this.source, this.frame, this.orig, this.trim, this.rotation);
    }

    /**
     * Destroys this texture.
     *
     * @param {object|boolean} options - A boolean will act as if all options are set to that value.
     * @param {boolean} [options.destroySource=false] - Whether to destroy the texture source as well.
     */
    destroy(options)
    {
        const destroySource = typeof options === 'boolean' ? options : options && options.baseTexture;

        if (this._onSourceUpdateBinding) this._onSourceUpdateBinding.detach();
        if (this._onSourceReadyBinding) this._onSourceReadyBinding.detach();

        this._onSourceUpdateBinding = null;
        this._onSourceReadyBinding = null;

        if (destroySource)
        {
            this.source.destroy();
        }

        this.source = null;
        this.trim = null;
        this.orig = null;

        this.onUpdate.detachAll();
        this.onUpdate = null;

        this._frame = null;
        this._uvs = null;
    }

    /**
     * Called when the source is ready.
     *
     * @private
     */
    _onSourceReady()
    {
        if (this._explicitFrame)
        {
            // validate and update frame properties by calling setter
            this.frame = this._frame;
        }
        else
        {
            this.frame = new math.Rectangle(0, 0, this.source.width, this.source.height);
        }
    }

    /**
     * Called when the source is updated.
     *
     * @private
     */
    _onSourceUpdate()
    {
        this._frame.width = this.source.width;
        this._frame.height = this.source.height;

        this.onUpdate.dispatch();
    }

    /**
     * Updates the UV coords of this texture.
     *
     * @private
     */
    _updateUVs()
    {
        this._uvs.set(this._frame, this.source, this.rotation);
    }
}

Texture.EMPTY = new Texture(TextureSource.EMPTY);
Texture.EMPTY.destroy = function _noop() { /* empty */ }; // eslint-disable-line brace-style
