import Matrix2d from '../math/Matrix2d';
import Vector2d from '../math/Vector2d';

// TODO: Pivot and skew

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
     *
     */
    constructor()
    {
        /**
         * The global matrix transform, it is written to the passed in output buffer.
         *
         * @member {Matrix2d}
         */
        this._wt = new Matrix2d();

        /**
         * The local matrix transform.
         *
         * @member {Matrix2d}
         */
        this._lt = new Matrix2d();

        /**
         * A tracker for delta changes for passing into matrix functions.
         *
         * @private
         * @member {Vector2d}
         */
        this._delta = new Vector2d();

        /**
         * Position component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._position = new Vector2d();

        /**
         * Scale component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._scale = new Vector2d();

        /**
         * Skew component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._skew = new Vector2d();

        /**
         * Pivot component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._pivot = new Vector2d();

        /**
         * Rotation component of transform.
         *
         * @private
         * @member {number}
         */
        this._rotation = 0;

        // set scale to 1
        this.scaleX = 1.0;
        this.scaleY = 1.0;
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
     * The Y position.
     *
     * @member {number}
     */
    get y()
    {
        return this._position.y;
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
     * The Y scale.
     *
     * @member {number}
     */
    get scaleY()
    {
        return this._scale.y;
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
     * The Y skew.
     *
     * @member {number}
     */
    get skewY()
    {
        return this._skew.y;
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
     * The Y pivot.
     *
     * @member {number}
     */
    get pivotY()
    {
        return this._pivot.y;
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
     * Sets X position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set x(v)
    {
        this.translate(v - this._position.x, 0.0);
    }

    /**
     * Sets Y position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set y(v)
    {
        this.translate(0.0, v - this._position.y);
    }

    /**
     * Sets X scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleX(v)
    {
        this.scale(v - this._scale.x, 0.0);
    }

    /**
     * Sets Y scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleY(v)
    {
        this.scale(0.0, v - this._scale.y);
    }

    /**
     * Sets X skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewX(v)
    {
        this.skew(v - this._skew.x, 0.0);
    }

    /**
     * Sets Y skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewY(v)
    {
        this.skew(0.0, v - this._skew.y);
    }

    /**
     * Sets X pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotX(v)
    {
        /* empty for now */
        this._pivot.x = v;
    }

    /**
     * Sets Y pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotY(v)
    {
        /* empty for now */
        this._pivot.y = v;
    }

    /**
     * Sets rotation of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set rotation(v)
    {
        this.rotate(v - this._rotation);
    }

    /**
     * Updates the world transform based on the passed transform.
     *
     * @param {Transform} parent - The parent transform to update with.
     */
    update(parent)
    {
        this._wt.copy(this._lt);
        this._wt.multiply(parent);
    }

    /**
     * Translates the transform by the given coords.
     *
     * @param {number} x - The X amount to translate by.
     * @param {number} y - The Y amount to translate by.
     * @return {Transform} returns itself.
     */
    translate(x, y)
    {
        this._lt.translate(x, y);

        this._position.x += x;
        this._position.y += y;

        return this;
    }

    /**
     * Scales the transform by the given coords.
     *
     * @param {number} x - The X amount to scale by.
     * @param {number} y - The Y amount to scale by.
     * @return {Transform} returns itself.
     */
    scale(x, y)
    {
        this._lt.scale(x, y);

        this._scale.x += x;
        this._scale.y += y;

        return this;
    }

    /**
     * Skews the transform by the given coords.
     *
     * @param {number} x - The X amount to skew by.
     * @param {number} y - The Y amount to skew by.
     * @return {Transform} returns itself.
     */
    skew(x, y)
    {
        this._skew.x = x;
        this._skew.y = y;

        return this;
    }

    /**
     * Scales the transform by the given coords.
     *
     * @param {number} rad - The angle to rotate by in radians.
     * @return {Transform} returns itself.
     */
    rotate(rad)
    {
        this._lt.rotate(rad);

        this._rotation += rad;

        return this;
    }

    /**
     * Destroys this transform object.
     */
    destroy()
    {
        this._wt = null;
        this._lt = null;
        this._delta = null;
        this._position = null;
        this._scale = null;
        this._skew = null;
        this._pivot = null;
    }
}
