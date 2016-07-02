import { TYPE } from '../../config';

/**
 * A simple class representing a rectangle. A Rectangle is defined by its position,
 * as indicated by its top-left corner point (x, y) and by its width and its height.
 *
 * @class
 */
export default class Rectangle
{

    /**
     * @param {number} x - The X coordinate of the upper-left corner of the rectangle
     * @param {number} y - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} width - The overall width of this rectangle
     * @param {number} height - The overall height of this rectangle
     */
    constructor(x = 0, y = 0, width = 1, height = 1)
    {
        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         */
        this.type = TYPE.SHAPE_RECTANGLE;

        /**
         * The X position of the top-left of the rectangle.
         *
         * @member {number}
         */
        this.x = x;

        /**
         * The Y position of the top-left of the rectangle.
         *
         * @member {number}
         */
        this.y = y;

        /**
         * The width of the rectangle.
         *
         * @member {number}
         */
        this.width = width;

        /**
         * The height of the rectangle.
         *
         * @member {number}
         */
        this.height = height;
    }

    /**
     * Creates a clone of this Rectangle
     *
     * @return {Rectangle} a copy of the rectangle.
     */
    clone()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Copies the passed rectangle into this one.
     *
     * @return {Rectangle} returns itself.
     */
    copy(rectangle)
    {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;

        return this;
    }

    /**
     * Checks whether the x and y coordinates given are contained within this Rectangle
     *
     * @param {number} x - The X coordinate of the point to test.
     * @param {number} y - The Y coordinate of the point to test.
     * @return {boolean} Whether the x/y coordinates are within this Rectangle.
     */
    contains(x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        if (x >= this.x && x < this.x + this.width)
        {
            if (y >= this.y && y < this.y + this.height)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Grows the rectangle on all sides.
     *
     * For example, this rectangle:
     *
     * ```
     *     ----------
     *     |        |
     *     |        |
     *     ----------
     * ```
     *
     * After a call to `pad(5, 5)` becomes something like:
     *
     * ```
     *    ---------------
     *    |             |
     *    |             |
     *    |             |
     *    ---------------
     * ```
     *
     * Notice that the position (top-left) doesn't stay in the same
     * place, it moved back slightly.
     *
     * @param {number} paddingX - The amount to "grow" in the X direction.
     * @param {number} paddingY - The amount to "grow" in the Y direction.
     * @return {Rectangle} returns itself.
     */
    pad(paddingX, paddingY)
    {
        paddingX = paddingX || 0;
        paddingY = paddingY || ((paddingY !== 0) ? paddingX : 0);

        this.x -= paddingX;
        this.y -= paddingY;

        this.width += paddingX * 2;
        this.height += paddingY * 2;

        return this;
    }

    /**
     * Manipulates this rectangle so that becomes the same size as the passed rectangle.
     * The big difference between this method and just copying the values of the other
     * rectangle is that this ensures that this rectangle never goes below x/y of 0
     * and width/height of 0.
     *
     * @param {Rectangle} rectangle - The rectangle to grow to encompass.
     * @return {Rectangle} returns itself.
     */
    fit(rectangle)
    {
        if (this.x < rectangle.x)
        {
            this.width += this.x;

            if (this.width < 0) this.width = 0;

            this.x = rectangle.x;
        }

        if (this.y < rectangle.y)
        {
            this.height += this.y;

            if (this.height < 0) this.height = 0;

            this.y = rectangle.y;
        }

        if (this.x + this.width > rectangle.x + rectangle.width)
        {
            this.width = rectangle.width - this.x;

            if (this.width < 0) this.width = 0;
        }

        if (this.y + this.height > rectangle.y + rectangle.height)
        {
            this.height = rectangle.height - this.y;

            if (this.height < 0) this.height = 0;
        }

        return this;
    }

    /**
     * Checks if the passed rectangle is equal to this one (has the same points).
     *
     * @param {Rectangle} rectangle - The rectangle to check for equality.
     * @return {boolean} Whether rectangle are equal.
     */
    equals(rectangle)
    {
        return rectangle.x === this.x
            && rectangle.y === this.y
            && rectangle.width === this.width
            && rectangle.height === this.height;
    }
}

/**
 * A constant empty rectangle.
 *
 * @static
 * @constant
 */
Rectangle.EMPTY = new Rectangle(0, 0, 0, 0);
