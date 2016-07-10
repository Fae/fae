import Matrix2d from '../math/Matrix2d';
import Vector2d from '../math/Vector2d';

const INDEX = {
    POSITION: 0,
    SCALE: Vector2d.LENGTH,
    SKEW: Vector2d.LENGTH * 2,
    PIVOT: Vector2d.LENGTH * 3,
    DELTA: Vector2d.LENGTH * 4,
    ROTATION: Vector2d.LENGTH * 5,
    LOCAL_MATRIX: (Vector2d.LENGTH * 5) + 1,
};

const BYTE_OFFSET = {
    POSITION: 0,
    SCALE: Vector2d.BYTE_SIZE,
    SKEW: Vector2d.BYTE_SIZE * 2,
    PIVOT: Vector2d.BYTE_SIZE * 3,
    DELTA: Vector2d.LENGTH * 4,
    ROTATION: Vector2d.BYTE_SIZE * 5,
    LOCAL_MATRIX: (Vector2d.BYTE_SIZE * 5) + Float32Array.BYTES_PER_ELEMENT,
};

/**
 * Size in bytes of a Transform.
 *
 * @static
 * @returns {number} byte size of a Transform.
 */
const DATA_BYTE_SIZE = BYTE_OFFSET.LOCAL_MATRIX + Matrix2d.BYTE_SIZE;

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
     * @param {ArrayBuffer|SharedArrayBuffer} outBuffer - The buffer for the transform to write the world transform to.
     * @param {number} outByteOffset - The offset in the buffer to write to.
     */
    constructor(outBuffer, outByteOffset)
    {
        /**
         * Raw data buffer that contains the data of this transform.
         *
         * @private
         * @member {ArrayBuffer|SharedArrayBuffer}
         */
        this._buffer = new ArrayBuffer(DATA_BYTE_SIZE);
        this._data = new Float32Array(this._buffer);

        /**
         * The global matrix transform, it is written to the passed in output buffer.
         *
         * @member {Matrix2d}
         */
        this._wt = new Matrix2d(outBuffer, outByteOffset);

        /**
         * The local matrix transform.
         *
         * @member {Matrix2d}
         */
        this._lt = new Matrix2d(this._buffer, BYTE_OFFSET.LOCAL_MATRIX);

        /**
         * A tracker for delta changes for passing into matrix functions.
         *
         * @private
         * @member {Vector2d}
         */
        this._delta = new Vector2d(this._buffer, BYTE_OFFSET.DELTA);

        // set scale to 1
        this._data[INDEX.SCALE] = 1.0;
        this._data[INDEX.SCALE + 1] = 1.0;
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
        return this._data[INDEX.POSITION];
    }

    /**
     * The Y position.
     *
     * @member {number}
     */
    get y()
    {
        return this._data[INDEX.POSITION + 1];
    }

    /**
     * The X scale.
     *
     * @member {number}
     */
    get scaleX()
    {
        return this._data[INDEX.SCALE];
    }

    /**
     * The Y scale.
     *
     * @member {number}
     */
    get scaleY()
    {
        return this._data[INDEX.SCALE + 1];
    }

    /**
     * The X skew.
     *
     * @member {number}
     */
    get skewX()
    {
        return this._data[INDEX.SKEW];
    }

    /**
     * The Y skew.
     *
     * @member {number}
     */
    get skewY()
    {
        return this._data[INDEX.SKEW + 1];
    }

    /**
     * The X pivot.
     *
     * @member {number}
     */
    get pivotX()
    {
        return this._data[INDEX.PIVOT];
    }

    /**
     * The Y pivot.
     *
     * @member {number}
     */
    get pivotY()
    {
        return this._data[INDEX.PIVOT + 1];
    }

    /**
     * The rotation.
     *
     * @member {number}
     */
    get rotation()
    {
        return this._data[INDEX.ROTATION];
    }

    /**
     * Sets X position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set x(v)
    {
        this.translate(v - this.x, 0.0);
    }

    /**
     * Sets Y position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set y(v)
    {
        this.translate(0.0, v - this.y);
    }

    /**
     * Sets X scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleX(v)
    {
        this.scale(v - this.scaleX, 0.0);
    }

    /**
     * Sets Y scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleY(v)
    {
        this.scale(0.0, v - this.scaleY);
    }

    /**
     * Sets X skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewX(v)
    {
        this.skew(v - this.skewX, 0.0);
    }

    /**
     * Sets Y skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewY(v)
    {
        this.skew(0.0, v - this.skewY);
    }

    /**
     * Sets X pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotX(v)
    {
        /* empty for now */
        this._data[INDEX.PIVOT] = v;
    }

    /**
     * Sets Y pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotY(v)
    {
        /* empty for now */
        this._data[INDEX.PIVOT + 1] = v;
    }

    /**
     * Sets rotation of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set rotation(v)
    {
        this.rotate(v - this.rotation);
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

        this._data[INDEX.POSITION] += x;
        this._data[INDEX.POSITION + 1] += y;

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

        this._data[INDEX.SCALE] += x;
        this._data[INDEX.SCALE + 1] += y;

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
        this._data[INDEX.SKEW] = x;
        this._data[INDEX.SKEW + 1] = y;

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

        this._data[INDEX.ROTATION] += rad;

        return this;
    }

    /**
     * Destroys this transform object.
     */
    destroy()
    {
        this._buffer = null;
        this._data = null;
        this._wt = null;
        this._lt = null;
        this._delta = null;
    }
}
