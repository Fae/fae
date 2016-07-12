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
    constructor(x = 0, y = 0, width = 0, height = 0)
    {
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
     * The left-most X coord of this rectangle.
     *
     * @member {number}
     */
    get left()
    {
        return this.x;
    }

    /**
     * The right-most X coord of this rectangle.
     *
     * @member {number}
     */
    get right()
    {
        return this.x + this.width;
    }

    /**
     * The top-most Y coord of this rectangle.
     *
     * @member {number}
     */
    get top()
    {
        return this.y;
    }

    /**
     * The bottom-most Y coord of this rectangle.
     *
     * @member {number}
     */
    get bottom()
    {
        return this.y + this.height;
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
     * @param {Rectangle} rectangle - The rectangle to copy from.
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
     * Grows the rectangle to contain the passed rectangle. Expanding size
     * and reducing position as necessary.
     *
     * For example, given these rectangles:
     *
     * ```
     * -----------------
     * | 1 ----------  |
     * |   | 2      |  |
     * ----|--------|--
     *     ----------
     * ```
     *
     * If we call `rect1.union(rect2)` we get this rectangle:
     *
     * ```
     * -----------------
     * | 1             |
     * |               |
     * |               |
     * ----------------
     * ```
     *
     * This happens even if they do not intersect.
     *
     * @param {Rectangle} rect -The rectangle to union with.
     * @return {Rectangle} Returns itself.
     */
    union(rect)
    {
        const x = this.x;
        const y = this.y;

        this.x = Math.min(rect.x, this.x);
        this.y = Math.min(rect.y, this.y);

        this.width = Math.max(rect.x + rect.width, x + this.width) - this.x;
        this.height = Math.max(rect.y + rect.height, y + this.height) - this.y;

        return this;
    }

    /**
     * Sets this rectangle to the intersection of this rectangle and the passed one.
     *
     * For example, given these rectangles:
     *
     * ```
     * -----------------
     * | 1 ----------  |
     * |   | 2      |  |
     * ----|--------|--
     *     ----------
     * ```
     *
     * If we call `rect1.intersection(rect2)` we get this rectangle:
     *
     * ```
     *
     *     ----------
     *     | 1      |
     *     ---------
     *
     * ```
     *
     * This happens even if they do not intersect.
     *
     * @param {Rectangle} rect -The rectangle to union with.
     * @return {Rectangle} Returns itself.
     */
    intersection(rect)
    {
        const x = this.x;
        const y = this.y;

        this.x = Math.max(rect.x, this.x);
        this.y = Math.max(rect.y, this.y);

        this.width = Math.min(rect.x + rect.width, x + this.widthR) - this.x;
        this.height = Math.min(rect.y + rect.height, y + this.height) - this.y;

        return this;
    }

    /**
     * Grows the rectangle on all sides. The center stays constant.
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
     * @param {number} dx - The amount to "grow" in the X direction.
     * @param {number} dy - The amount to "grow" in the Y direction.
     * @return {Rectangle} returns itself.
     */
    inflate(dx = 0, dy = 0)
    {
        this.x -= dx;
        this.y -= dy;
        this.width += dx * 2;
        this.height += dy * 2;

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
        return !!rectangle
            && rectangle.x === this.x
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
Rectangle.EMPTY = new Rectangle();
