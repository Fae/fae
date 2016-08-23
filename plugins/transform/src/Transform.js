import { math/* @ifdef DEBUG */, debug /* @endif */ } from '@fae/core';

/**
 * Generic class to deal with traditional 2D matrix transforms
 * This will be reworked in v4.1, please do not use it yet unless you know what are you doing!
 *
 * @class
 * @memberof PIXI
 */
export default class Transform
{
    /**
     * Constructs a new Transform object.
     *
     */
    constructor()
    {
        /**
         * The parent transform to update against.
         *
         * @member {Transform}
         * @default null
         */
        this.parent = null;

        /**
         * The global matrix transform, it is written to the passed in output buffer.
         *
         * @private
         * @member {Matrix2d}
         */
        this._wt = new math.Matrix2d();

        /**
         * The local matrix transform.
         *
         * @private
         * @member {Matrix2d}
         */
        this._lt = new math.Matrix2d();

        /**
         * Position component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._position = new math.Vector2d();

        /**
         * Scale component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._scale = new math.Vector2d(1, 1);

        /**
         * Skew component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._skew = new math.Vector2d();

        /**
         * Pivot component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._pivot = new math.Vector2d();

        /**
         * Rotation component of transform.
         *
         * @private
         * @member {number}
         */
        this._rotation = 0;

        // dirty trackers when updates are made to matrices
        this._localUpdateId = 0;
        this._worldUpdateId = 0;
        this._cachedLocalUpdateId = -1;
        this._cachedWorldUpdateId = -1;

        // cache vars for expensive trig functions
        this._sr = Math.sin(0);
        this._cr = Math.cos(0);
        this._cy = Math.cos(0); // skewY
        this._sy = Math.sin(0); // skewY
        this._sx = Math.sin(0); // skewX
        this._cx = Math.cos(0); // skewX
    }

    /**
     * The local transformation matrix.
     *
     * @member {Matrix2d}
     */
    get localTransform()
    {
        return this._lt;
    }

    /**
     * The world transformation matrix.
     *
     * @member {Matrix2d}
     */
    get worldTransform()
    {
        return this._wt;
    }

    /**
     * The X position.
     *
     * @member {number}
     */
    get x()
    {
        return this._position.x;
    }

    /**
     * Sets X position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set x(v)
    {
        this._position.x = v;
        this._localUpdateId++;
    }

    /**
     * The Y position.
     *
     * @member {number}
     */
    get y()
    {
        return this._position.y;
    }

    /**
     * Sets Y position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set y(v)
    {
        this._position.y = v;
        this._localUpdateId++;
    }

    /**
     * The X scale.
     *
     * @member {number}
     */
    get scaleX()
    {
        return this._scale.x;
    }

    /**
     * Sets X scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleX(v)
    {
        this._scale.x = v;
        this._localUpdateId++;
    }

    /**
     * The Y scale.
     *
     * @member {number}
     */
    get scaleY()
    {
        return this._scale.y;
    }

    /**
     * Sets Y scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleY(v)
    {
        this._scale.y = v;
        this._localUpdateId++;
    }

    /**
     * The X skew.
     *
     * @member {number}
     */
    get skewX()
    {
        return this._skew.x;
    }

    /**
     * Sets X skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewX(v)
    {
        this._skew.x = v;
        this._sx = Math.sin(v);
        this._cx = Math.cos(v);
        this._localUpdateId++;
    }

    /**
     * The Y skew.
     *
     * @member {number}
     */
    get skewY()
    {
        return this._skew.y;
    }

    /**
     * Sets Y skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewY(v)
    {
        this._skew.y = v;
        this._cy = Math.cos(v);
        this._sy = Math.sin(v);
        this._localUpdateId++;
    }

    /**
     * The X pivot.
     *
     * @member {number}
     */
    get pivotX()
    {
        return this._pivot.x;
    }

    /**
     * Sets X pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotX(v)
    {
        this._pivot.x = v;
        this._localUpdateId++;
    }

    /**
     * The Y pivot.
     *
     * @member {number}
     */
    get pivotY()
    {
        return this._pivot.y;
    }

    /**
     * Sets Y pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotY(v)
    {
        this._pivot.y = v;
        this._localUpdateId++;
    }

    /**
     * The rotation.
     *
     * @member {number}
     */
    get rotation()
    {
        return this._rotation;
    }

    /**
     * Sets rotation of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set rotation(v)
    {
        this._rotation = v;
        this._sr = Math.sin(v);
        this._cr = Math.cos(v);
        this._localUpdateId++;
    }

    /**
     * Invalidates the cached parent transform which forces an update next time.
     *
     */
    invalidate()
    {
        this._cachedWorldUpdateId = -1;
    }

    /**
     * Updates the world transform based on the passed transform.
     *
     */
    update()
    {
        this.dirty = true;

        const wt = this._wt;
        const lt = this._lt;

        if (this._localUpdateId !== this._cachedLocalUpdateId)
        {
            const a =  this._cr * this._scale.x;
            const b =  this._sr * this._scale.x;
            const c = -this._sr * this._scale.y;
            const d =  this._cr * this._scale.y;

            // skew
            lt.a = (this._cy * a) + (this._sy * c);
            lt.b = (this._cy * b) + (this._sy * d);
            lt.c = (this._sx * a) + (this._cx * c);
            lt.d = (this._sx * b) + (this._cx * d);

            // translation
            lt.tx = this._position.x - ((this._pivot.x * lt.a) + (this._pivot.y * lt.c));
            lt.ty = this._position.y - ((this._pivot.x * lt.b) + (this._pivot.y * lt.d));

            this._cachedLocalUpdateId = this._localUpdateId;
            this._cachedWorldUpdateId = -1;
        }

        // @ifdef DEBUG
        debug.ASSERT(this._lt.valid(), 'Invalid local transform, property is set incorrectly somewhere...');
        // @endif

        if (this.parent)
        {
            if (this._cachedWorldUpdateId !== this.parent._worldUpdateId)
            {
                const pt = this.parent._wt;

                // multiply the parent matrix with the objects transform.
                wt.a = (lt.a * pt.a) + (lt.b * pt.c);
                wt.b = (lt.a * pt.b) + (lt.b * pt.d);
                wt.c = (lt.c * pt.a) + (lt.d * pt.c);
                wt.d = (lt.c * pt.b) + (lt.d * pt.d);
                wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
                wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;

                this._cachedWorldUpdateId = this.parent._worldUpdateId;
                this._worldUpdateId++;
            }
        }
        else if (this._cachedWorldUpdateId !== this._worldUpdateId)
        {
            wt.copy(this._lt);
            this._worldUpdateId++;
            this._cachedWorldUpdateId = this._worldUpdateId;
        }

        // @ifdef DEBUG
        debug.ASSERT(this._wt.valid(), 'Invalid world transform, property is set incorrectly somewhere...');
        // @endif
    }

    /**
     * Destroys this transform object.
     */
    destroy()
    {
        this._wt = null;
        this._lt = null;
        this._position = null;
        this._scale = null;
        this._skew = null;
        this._pivot = null;
    }
}

/**
 * The identity transform.
 *
 * @static
 * @constant
 * @type {Transform}
 */
Transform.IDENTITY = new Transform();
