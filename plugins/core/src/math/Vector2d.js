/* eslint max-params: [2, { max: 6 }] */

/**
 * This is a modified version of Brandon Jones's Vector2d utility.
 *
 * modified by cengler
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @ignore
 */
const EPSILON = 0.000001;

/**
 * A Vector2d is an object defined as:
 *
 * ```js
 * [x, y]
 * ```
 *
 * @class
 * @memberof math
 */
export default class Vector2d
{
    /**
     * Creates a new, empty Vector2d
     *
     * @param {number} x - The starting x value.
     * @param {number} y - The starting y value.
     */
    constructor(x = 0, y = 0)
    {
        /**
         * The `x` component of the Vector2d.
         *
         * @member {number}
         */
        this.x = x;

        /**
         * The `y` component of the Vector2d.
         *
         * @member {number}
         */
        this.y = y;
    }

    /**
     * Copy the values from one Vector2d to another
     *
     * @param {Vector2d} b - the source vector.
     * @return {Vector2d} returns itself.
     */
    copy(b)
    {
        this.x = b.x;
        this.y = b.y;

        return this;
    }

    /**
     * Set the components of a Vector2d to the given values
     *
     * @param {number} x - X component.
     * @param {number} y - Y component.
     * @return {Vector2d} returns itself.
     */
    set(x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Adds a vector `b` to this one.
     *
     * @param {Vector2d} b - the operand to add to this vector.
     * @return {Vector2d} returns itself.
     */
    add(b)
    {
        this.x += b.x;
        this.y += b.y;

        return this;
    }

    /**
     * Subtracts vector `b` from this one.
     *
     * @param {Vector2d} b - the operand to subtract from this vector.
     * @return {Vector2d} returns itself.
     */
    subtract(b)
    {
        this.x -= b.x;
        this.y -= b.y;

        return this;
    }

    /**
     * Multiplies this vector by `b`.
     *
     * @param {Vector2d} b - the operand to multiply this vector by.
     * @return {Vector2d} returns itself.
     */
    multiply(b)
    {
        this.x *= b.x;
        this.y *= b.y;

        return this;
    }

    /**
     * Divides this vector by `b`.
     *
     * @param {Vector2d} b - the operand to divide this vector by.
     * @return {Vector2d} returns itself.
     */
    divide(b)
    {
        this.x /= b.x;
        this.y /= b.y;

        return this;
    }

    /**
     * Math.ceil the components of this vector.
     *
     * @return {Vector2d} returns itself.
     */
    ceil()
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

        return this;
    }

    /**
     * Math.floor the components of this vector.
     *
     * @return {Vector2d} returns itself.
     */
    floor()
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        return this;
    }

    /**
     * Sets the components to the minimum of this vector and the passed vector.
     *
     * @param {Vector2d} b - the operand to check for min values.
     * @return {Vector2d} returns itself.
     */
    min(b)
    {
        this.x = Math.min(this.x, b.x);
        this.y = Math.min(this.y, b.y);

        return this;
    }

    /**
     * Sets the components to the maximum of this vector and the passed vector.
     *
     * @param {Vector2d} b - the operand to check for max values.
     * @return {Vector2d} returns itself.
     */
    max(b)
    {
        this.x = Math.max(this.x, b.x);
        this.y = Math.max(this.y, b.y);

        return this;
    }

    /**
     * Math.round the components of this vector.
     *
     * @return {Vector2d} returns itself.
     */
    round()
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    /**
     * Scales this vector by a scalar number.
     *
     * @param {number} b - amount to scale the vector by.
     * @return {Vector2d} returns itself.
     */
    scale(b)
    {
        this.x *= b;
        this.y *= b;

        return this;
    }

    /**
     * Scales each component of the passed vector by the given scalar, then adds the result
     * to each respective component of this vector.
     *
     * @param {Vector2d} b - the vector to scale before adding into this vector.
     * @param {number} scale - the amount to scale b's elements by before adding.
     * @return {Vector2d} returns itself.
     */
    scaleAndAdd(b, scale)
    {
        this.x += (b.x * scale);
        this.y += (b.y * scale);

        return this;
    }

    /**
     * Calculates the euclidian distance between the passed vector and this one.
     *
     * @param {Vector2d} b - the operand to calculate distance to.
     * @return {number} distance between this vector and b.
     */
    distance(b)
    {
        const x = b.x - this.x;
        const y = b.y - this.y;

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * Calculates the squared euclidian distance between the passed vector and this one.
     *
     * @param {Vector2d} b - the operand to calculate distance to.
     * @return {number} squared distance between this vector and b.
     */
    squaredDistance(b)
    {
        const x = b.x - this.x;
        const y = b.y - this.y;

        return (x * x) + (y * y);
    }

    /**
     * Calculates the length of the vector.
     *
     * @return {number} length of the vector.
     */
    length()
    {
        const x = this.x;
        const y = this.y;

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * Calculates the squared length of the vector.
     *
     * @return {number} squared length of the vector.
     */
    squaredLength()
    {
        const x = this.x;
        const y = this.y;

        return (x * x) + (y * y);
    }

    /**
     * Negates the components of the vector.
     *
     * @return {Vector2d} returns itself.
     */
    negate()
    {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    /**
     * Returns the inverse of the components of the vector.
     *
     * @return {Vector2d} returns itself.
     */
    inverse()
    {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;

        return this;
    }

    /**
     * Normalizes the vector.
     *
     * @return {Vector2d} returns itself.
     */
    normalize()
    {
        const x = this.x;
        const y = this.y;

        let len = (x * x) + (y * y);

        if (len > 0)
        {
            // TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            this.x = this.x * len;
            this.y = this.y * len;
        }

        return this;
    }

    /**
     * Calculates the dot product of the vector and the passed vector.
     *
     * @param {Vector2d} b - the operand to dot with.
     * @return {number} dot product of this vector and b.
     */
    dot(b)
    {
        return (this.x * b.x) + (this.y * b.y);
    }

    /**
     * Linearly interpolates this vector towards the passed vector
     * using the passed interpolation ammount (`t`).
     *
     * @param {Vector2d} b - the operand to lerp to.
     * @param {number} t - interpolation amount between the two vectors.
     * @return {Vector2d} returns itself.
     */
    lerp(b, t)
    {
        this.x += (t * (b.x - this.x));
        this.y += (t * (b.y - this.y));

        return this;
    }

    /**
     * Sets the components to random numbers with the given scale.
     *
     * @param {number} scale - Length of the resulting vector. If ommitted, a unit vector will be returned.
     * @return {Vector2d} returns itself.
     */
    random(scale = 1.0)
    {
        const r = Math.random() * 2.0 * Math.PI;

        this.x = Math.cos(r) * scale;
        this.y = Math.sin(r) * scale;

        return this;
    }

    /**
     * Transforms the vector with a Matrix2d
     *
     * @param {Matrix2d} m - matrix to transform with.
     * @return {Vector2d} returns itself.
     */
    transformMatrix2d(m)
    {
        const x = this.x;
        const y = this.y;

        this.x = (m.a * x) + (m.c * y) + m.tx;
        this.y = (m.b * x) + (m.d * y) + m.ty;

        return this;
    }

    /**
     * Returns a string representation of a vector
     *
     * @return {string} string representation of the vector
     */
    toString()
    {
        return `Vector2d(${this.x}, ${this.y})`;
    }

    /**
     * Returns whether or not the passed vector has exactly the same elements in
     * the same position (when compared with ===) as this one.
     *
     * @param {Vector2d} b - The vector to check equality against.
     * @return {boolean} True if the vectors are equal, false otherwise.
     */
    exactEquals(b)
    {
        return this.x === b.x && this.y === b.y;
    }

    /**
     * Returns whether or not the passed vector has approximately the same elements in
     * the same position (when compared with ===) as this one.
     *
     * @param {Vector2d} b - The vector to check equality against.
     * @return {boolean} True if the vectors are equal, false otherwise.
     */
    equals(b)
    {
        if (!b) return false;

        const a0 = this.x;
        const a1 = this.y;
        const b0 = b.x;
        const b1 = b.y;

        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0))
            && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
    }
}

/**
 * Returns the number of elements this vector has.
 *
 * @static
 * @return {number} number of elements in a Vector2d.
 */
Vector2d.LENGTH = 2;

/**
 * Size in bytes of a Matrix2d.
 *
 * @static
 * @return {number} byte size of a Matrix2d.
 */
Vector2d.BYTE_SIZE = Vector2d.LENGTH * Vector2d.BYTES_PER_ELEMENT;
