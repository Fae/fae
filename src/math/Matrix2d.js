/**
 * This is a modified version of Brandon Jones's mat2d utility.
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
 * A 2x3 matrix.
 *
 * A Matrix2d is a Float32Array that contains six elements defined as:
 *
 * ```js
 * [a, b, c, d, tx, ty]
 * ```
 *
 * This is a short form for a 3x3 transformation matrix:
 *
 * ```
 * | a  c  tx|
 * | b  d  ty|
 * | 0  0  1 |
 * ```
 *
 * The last row is ignored so the array is shorter and operations are faster.
 *
 * For those unfamiliar with 3x3 transformation matrices, you could say that:
 *
 * - `a` and `d` affect scale,
 * - `c` and `b` affect rotation, and
 * - `tx` and `ty` affect translation.
 *
 * It is a bit more interconnected than that, but thats basic gist.
 *
 * @class
 */
export default class Matrix2d extends Float32Array
{
    /**
     * Creates a new identity Matrix2d
     *
     * @param {ArrayBuffer|SharedArrayBufffer} buffer - The buffer to write to.
     * @param {number} byteOffset - The byteOffset into the buffer to write to.
     */
    constructor(buffer = new ArrayBuffer(24), byteOffset = 0)
    {
        super(buffer, byteOffset, Matrix2d.ELEMENT_LENGTH);

        this.identity();
    }

    /**
     * The `a` (index 0) component of the Matrix2d.
     *
     * @type {number}
     */
    get a()
    {
        return this[0];
    }

    /**
     * Sets the `a` (index 0) component of the Matrix2d.
     *
     * @param {number} v - The value to set to.
     */
    set a(v)
    {
        this[0] = v;
    }

    /**
     * The `b` (index 1) component of the Matrix2d.
     *
     * @type {number}
     */
    get b()
    {
        return this[1];
    }

    /**
     * Sets the `b` (index 1) component of the Matrix2d.
     *
     * @param {number} v - The value to set to.
     */
    set b(v)
    {
        this[1] = v;
    }

    /**
     * The `c` (index 2) component of the Matrix2d.
     *
     * @type {number}
     */
    get c()
    {
        return this[2];
    }

    /**
     * Sets the `c` (index 2) component of the Matrix2d.
     *
     * @param {number} v - The value to set to.
     */
    set c(v)
    {
        this[2] = v;
    }

    /**
     * The `d` (index 3) component of the Matrix2d.
     *
     * @type {number}
     */
    get d()
    {
        return this[3];
    }

    /**
     * Sets the `d` (index 3) component of the Matrix2d.
     *
     * @param {number} v - The value to set to.
     */
    set d(v)
    {
        this[3] = v;
    }

    /**
     * The `tx` (index 4) component of the Matrix2d.
     *
     * @type {number}
     */
    get tx()
    {
        return this[4];
    }

    /**
     * Sets the `tx` (index 4) component of the Matrix2d.
     *
     * @param {number} v - The value to set to.
     */
    set tx(v)
    {
        this[4] = v;
    }

    /**
     * The `ty` (index 5) component of the Matrix2d.
     *
     * @type {number}
     */
    get ty()
    {
        return this[5];
    }

    /**
     * Sets the `ty` (index 5) component of the Matrix2d.
     *
     * @param {number} v - The value to set to.
     */
    set ty(v)
    {
        this[5] = v;
    }

    /**
     * Copy the values from a Matrix2d into this one.
     *
     * @param {Matrix2d} b - the source matrix.
     * @return {Matrix2d} returns itself.
     */
    copy(b)
    {
        this[0] = b[0];
        this[1] = b[1];
        this[2] = b[2];
        this[3] = b[3];
        this[4] = b[4];
        this[5] = b[5];

        return this;
    }

    /**
     * Sets the matrix to the identity matrix.
     *
     * @return {Matrix2d} returns itself.
     */
    identity()
    {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 1;
        this[4] = 0;
        this[5] = 0;

        return this;
    }

    /**
     * Sets the matrix components to the given values.
     *
     * @param {number} a - Component A (index 0).
     * @param {number} b - Component B (index 1).
     * @param {number} c - Component C (index 2).
     * @param {number} d - Component D (index 3).
     * @param {number} tx - Component TX (index 4).
     * @param {number} ty - Component TY (index 5).
     * @return {Matrix2d} returns itself.
     */
    set(a, b, c, d, tx, ty)
    {
        this[0] = a;
        this[1] = b;
        this[2] = c;
        this[3] = d;
        this[4] = tx;
        this[5] = ty;

        return this;
    }

    /**
     * Inverts the matrix.
     *
     * @param {Matrix2d} a - the source matrix.
     * @return {Matrix2d} returns itself.
     */
    invert()
    {
        const aa = this[0];
        const ab = this[1];
        const ac = this[2];
        const ad = this[3];
        const atx = this[4];
        const aty = this[5];

        let det = (aa * ad) - (ab * ac);

        if (!det) return null;

        det = 1.0 / det;

        this[0] = ad * det;
        this[1] = -ab * det;
        this[2] = -ac * det;
        this[3] = aa * det;
        this[4] = ((ac * aty) - (ad * atx)) * det;
        this[5] = ((ab * atx) - (aa * aty)) * det;

        return this;
    }

    /**
     * Calculates the determinant of this matrix.
     *
     * @return {number} determinant of this matrix.
     */
    determinant()
    {
        return (this[0] * this[3]) - (this[1] * this[2]);
    }

    /**
     * Multiplies this matrix by another Matrix2d.
     *
     * @param {Matrix2d} b - the operand to multiply this matrix by.
     * @return {Matrix2d} returns itself.
     */
    multiply(b)
    {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];
        const b0 = b[0];
        const b1 = b[1];
        const b2 = b[2];
        const b3 = b[3];
        const b4 = b[4];
        const b5 = b[5];

        this[0] = (a0 * b0) + (a2 * b1);
        this[1] = (a1 * b0) + (a3 * b1);
        this[2] = (a0 * b2) + (a2 * b3);
        this[3] = (a1 * b2) + (a3 * b3);
        this[4] = (a0 * b4) + (a2 * b5) + this[4];
        this[5] = (a1 * b4) + (a3 * b5) + this[5];

        return this;
    }

    /**
     * Rotates a this matrix by the given angle.
     *
     * @param {number} rad - the angle to rotate the matrix by.
     * @return {Matrix2d} returns itself.
     */
    rotate(rad)
    {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];
        const s = Math.sin(rad);
        const c = Math.cos(rad);

        this[0] = (a0 * c) + (a2 * s);
        this[1] = (a1 * c) + (a3 * s);
        this[2] = (a0 * -s) + (a2 * c);
        this[3] = (a1 * -s) + (a3 * c);

        return this;
    }

    /**
     * Scales the matrix by the dimensions in the given coords.
     *
     * @param {number} x - The X amount to scale by.
     * @param {number} y - The Y amount to scale by.
     * @return {Matrix2d} returns itself.
     **/
    scale(x, y)
    {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];

        this[0] = a0 * x;
        this[1] = a1 * x;
        this[2] = a2 * y;
        this[3] = a3 * y;

        return this;
    }

    /**
     * Translates the matrix by the dimensions in the given coords.
     *
     * @param {number} x - The X amount to translate by.
     * @param {number} y - The Y amount to translate by.
     * @return {Matrix2d} returns itself.
     **/
    translate(x, y)
    {
        this[4] = (this[0] * x) + (this[2] * y) + this[4];
        this[5] = (this[1] * x) + (this[3] * y) + this[5];

        return this;
    }

    /**
     * Returns a string representation of the matrix.
     *
     * @return {string} string representation of the matrix.
     */
    toString()
    {
        return `Matrix2d(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`;
    }

    /**
     * Returns Frobenius norm of the matrix.
     *
     * @return {number} Frobenius norm.
     */
    frob()
    {
        return (
            Math.sqrt(
                Math.pow(this[0], 2)
                + Math.pow(this[1], 2)
                + Math.pow(this[2], 2)
                + Math.pow(this[3], 2)
                + Math.pow(this[4], 2)
                + Math.pow(this[5], 2)
                + 1
            )
        );
    }

    /**
     * Adds the pass matrix to this one.
     *
     * @param {Matrix2d} b - the operand to add to this matrix.
     * @return {Matrix2d} returns itself.
     */
    add(b)
    {
        this[0] += b[0];
        this[1] += b[1];
        this[2] += b[2];
        this[3] += b[3];
        this[4] += b[4];
        this[5] += b[5];

        return this;
    }

    /**
     * Subtracts the passed matrix from this one.
     *
     * @param {Matrix2d} b - the operand to subtract from this matrix.
     * @return {Matrix2d} returns itself.
     */
    subtract(b)
    {
        this[0] -= b[0];
        this[1] -= b[1];
        this[2] -= b[2];
        this[3] -= b[3];
        this[4] -= b[4];
        this[5] -= b[5];

        return this;
    }

    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {number} b - amount to scale the matrix's elements by.
     * @return {Matrix2d} returns itself.
     */
    multiplyScalar(b)
    {
        this[0] *= b;
        this[1] *= b;
        this[2] *= b;
        this[3] *= b;
        this[4] *= b;
        this[5] *= b;

        return this;
    }

    /**
     * Scales each component of the passed matrix by the given scalar, then adds the result
     * to each respective component of this matrix.
     *
     * @param {Matrix2d} b - the matrix to scale before adding into this matrix.
     * @param {number} scale - the amount to scale b's elements by before adding.
     * @return {Matrix2d} returns itself.
     */
    multiplyScalarAndAdd(b, scale)
    {
        this[0] += (b[0] * scale);
        this[1] += (b[1] * scale);
        this[2] += (b[2] * scale);
        this[3] += (b[3] * scale);
        this[4] += (b[4] * scale);
        this[5] += (b[5] * scale);

        return this;
    }

    /**
     * Returns whether or not the passed matrix has exactly the same elements in the
     * same position (when compared with ===) as this one.
     *
     * @param {Matrix2d} b - The matrix to check equality against.
     * @return {boolean} True if the matrices are equal, false otherwise.
     */
    exactEquals(b)
    {
        return this[0] === b[0]
            && this[1] === b[1]
            && this[2] === b[2]
            && this[3] === b[3]
            && this[4] === b[4]
            && this[5] === b[5];
    }

    /**
     * Returns whether or not the passed matrix has approximately the same elements in the
     * same position as this one.
     *
     * @param {Matrix2d} b - The matrix to check equality against.
     * @return {boolean} True if the matrices are equal, false otherwise.
     */
    equals(b)
    {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];
        const a4 = this[4];
        const a5 = this[5];
        const b0 = b[0];
        const b1 = b[1];
        const b2 = b[2];
        const b3 = b[3];
        const b4 = b[4];
        const b5 = b[5];

        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0))
            && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1))
            && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2))
            && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
            && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4))
            && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)));
    }
}

/**
 * Returns the number of elements this matrix has.
 *
 * @static
 * @return {number} number of elements in a Matrix2d.
 */
Matrix2d.LENGTH = 6;

/**
 * Size in bytes of a Matrix2d.
 *
 * @static
 * @return {number} byte size of a Matrix2d.
 */
Matrix2d.BYTE_SIZE = Matrix2d.LENGTH * Matrix2d.BYTES_PER_ELEMENT;
