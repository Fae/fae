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

const EPSILON = 0.000001;

/**
 * A Vector2d is a Float32Array defined as:
 *
 * ```js
 * [x, y]
 * ```
 *
 * @class
 */
export default class Vector2d extends Float32Array
{
    /**
     * Creates a new, empty Vector2d
     *
     * @param {ArrayBuffer|SharedArrayBufffer} buffer - The buffer to write to.
     * @param {number} byteOffset - The byteOffset into the buffer to write to.
     */
    constructor(buffer = new ArrayBuffer(24), byteOffset = 0)
    {
        super(buffer, byteOffset, Vector2d.LENGTH);

        this[0] = 0;
        this[1] = 0;
    }

    /**
     * The `x` (index 0) component of the Vector2d.
     *
     * @member {number}
     */
    get x()
    {
        return this[0];
    }

    /**
     * Sets the `x` (index 0) component of the Vector2d.
     *
     * @param {number} v - The value to set to.
     */
    set x(v)
    {
        this[0] = v;
    }

    /**
     * The `y` (index 1) component of the Vector2d.
     *
     * @member {number}
     */
    get y()
    {
        return this[1];
    }

    /**
     * Sets the `y` (index 1) component of the Vector2d.
     *
     * @param {number} v - The value to set to.
     */
    set y(v)
    {
        this[1] = v;
    }

    /**
     * Copy the values from one Vector2d to another
     *
     * @param {Vector2d} b - the source vector.
     * @return {Vector2d} returns itself.
     */
    copy(b)
    {
        this[0] = b[0];
        this[1] = b[1];

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
        this[0] = x;
        this[1] = y;

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
        this[0] += b[0];
        this[1] += b[1];

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
        this[0] -= b[0];
        this[1] -= b[1];

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
        this[0] *= b[0];
        this[1] *= b[1];

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
        this[0] /= b[0];
        this[1] /= b[1];

        return this;
    }

    /**
     * Math.ceil the components of this vector.
     *
     * @return {Vector2d} returns itself.
     */
    ceil()
    {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);

        return this;
    }

    /**
     * Math.floor the components of this vector.
     *
     * @return {Vector2d} returns itself.
     */
    floor()
    {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);

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
        this[0] = Math.min(this[0], b[0]);
        this[1] = Math.min(this[1], b[1]);

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
        this[0] = Math.max(this[0], b[0]);
        this[1] = Math.max(this[1], b[1]);

        return this;
    }

    /**
     * Math.round the components of this vector.
     *
     * @return {Vector2d} returns itself.
     */
    round()
    {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);

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
        this[0] *= b;
        this[1] *= b;

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
        this[0] += (b[0] * scale);
        this[1] += (b[1] * scale);

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
        const x = b[0] - this[0];
        const y = b[1] - this[1];

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
        const x = b[0] - this[0];
        const y = b[1] - this[1];

        return (x * x) + (y * y);
    }

    /**
     * Calculates the length of the vector.
     *
     * @return {number} length of the vector.
     */
    length()
    {
        const x = this[0];
        const y = this[1];

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * Calculates the squared length of the vector.
     *
     * @return {number} squared length of the vector.
     */
    squaredLength()
    {
        const x = this[0];
        const y = this[1];

        return (x * x) + (y * y);
    }

    /**
     * Negates the components of the vector.
     *
     * @return {Vector2d} returns itself.
     */
    negate()
    {
        this[0] = -this[0];
        this[1] = -this[1];

        return this;
    }

    /**
     * Returns the inverse of the components of the vector.
     *
     * @return {Vector2d} returns itself.
     */
    inverse()
    {
        this[0] = 1.0 / this[0];
        this[1] = 1.0 / this[1];

        return this;
    }

    /**
     * Normalizes the vector.
     *
     * @return {Vector2d} returns itself.
     */
    normalize()
    {
        const x = this[0];
        const y = this[1];

        let len = (x * x) + (y * y);

        if (len > 0)
        {
            // TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            this[0] = this[0] * len;
            this[1] = this[1] * len;
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
        return (this[0] * b[0]) + (this[1] * b[1]);
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
        this[0] += (t * (b[0] - this[0]));
        this[1] += (t * (b[1] - this[1]));

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

        this[0] = Math.cos(r) * scale;
        this[1] = Math.sin(r) * scale;

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
        const x = this[0];
        const y = this[1];

        this[0] = (m[0] * x) + (m[2] * y) + m[4];
        this[1] = (m[1] * x) + (m[3] * y) + m[5];

        return this;
    }

    /**
     * Returns a string representation of a vector
     *
     * @return {string} string representation of the vector
     */
    toString()
    {
        return `Vector2d(${this[0]}, ${this[1]})`;
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
        return this[0] === b[0] && this[1] === b[1];
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
        const a0 = this[0];
        const a1 = this[1];
        const b0 = b[0];
        const b1 = b[1];

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
