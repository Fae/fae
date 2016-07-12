/* eslint max-params: [1, { "max": 6 }] */
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
export default class Matrix2d
{
    /**
     * Creates a new identity Matrix2d
     *
     */
    constructor()
    {
        this._mat3 = null;

        /**
         * The `a` component of the Matrix2d.
         *
         * @member {number}
         */
        this.a = 0;

        /**
         * The `b` component of the Matrix2d.
         *
         * @member {number}
         */
        this.b = 0;

        /**
         * The `c` component of the Matrix2d.
         *
         * @member {number}
         */
        this.c = 0;

        /**
         * The `d` component of the Matrix2d.
         *
         * @member {number}
         */
        this.d = 0;

        /**
         * The `tx` component of the Matrix2d.
         *
         * @member {number}
         */
        this.tx = 0;

        /**
         * The `ty` component of the Matrix2d.
         *
         * @member {number}
         */
        this.ty = 0;

        this.identity();
    }

    /**
     * Converts to the full 3x3 matrix form, optionally transposing.
     *
     * @param {boolean} transpose - Should we transpose the matrix?
     * @param {Float32Array} [out] - An optional array to assign values to.
     * @return {Float32Array} A 9-element array representing the 3x3 Matrix.
     */
    toMat3Array(transpose = true, out)
    {
        if (!out && !this._mat3)
        {
            this._mat3 = new Float32Array(9);
        }

        out = out || this._mat3;

        if (transpose)
        {
            out[0] = this.a;
            out[1] = this.b;
            out[2] = 0;
            out[3] = this.c;
            out[4] = this.d;
            out[5] = 0;
            out[6] = this.tx;
            out[7] = this.ty;
            out[8] = 1;
        }
        else
        {
            out[0] = this.a;
            out[1] = this.c;
            out[2] = this.tx;
            out[3] = this.b;
            out[4] = this.d;
            out[5] = this.ty;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
        }

        return out;
    }

    /**
     * Copy the values from a Matrix2d into this one.
     *
     * @param {Matrix2d} b - the source matrix.
     * @return {Matrix2d} returns itself.
     */
    copy(b)
    {
        this.a = b.a;
        this.b = b.b;
        this.c = b.c;
        this.d = b.d;
        this.tx = b.tx;
        this.ty = b.ty;

        return this;
    }

    /**
     * Sets the matrix to the identity matrix.
     *
     * @return {Matrix2d} returns itself.
     */
    identity()
    {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;

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
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

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
        const aa = this.a;
        const ab = this.b;
        const ac = this.c;
        const ad = this.d;
        const atx = this.tx;
        const aty = this.ty;

        let det = (aa * ad) - (ab * ac);

        if (!det) return null;

        det = 1.0 / det;

        this.a = ad * det;
        this.b = -ab * det;
        this.c = -ac * det;
        this.d = aa * det;
        this.tx = ((ac * aty) - (ad * atx)) * det;
        this.ty = ((ab * atx) - (aa * aty)) * det;

        return this;
    }

    /**
     * Calculates the determinant of this matrix.
     *
     * @return {number} determinant of this matrix.
     */
    determinant()
    {
        return (this.a * this.d) - (this.b * this.c);
    }

    /**
     * Multiplies this matrix by another Matrix2d.
     *
     * @param {Matrix2d} b - the operand to multiply this matrix by.
     * @return {Matrix2d} returns itself.
     */
    multiply(b)
    {
        const a0 = this.a;
        const a1 = this.b;
        const a2 = this.c;
        const a3 = this.d;
        const b0 = b.a;
        const b1 = b.b;
        const b2 = b.c;
        const b3 = b.d;
        const b4 = b.tx;
        const b5 = b.ty;

        this.a = (a0 * b0) + (a2 * b1);
        this.b = (a1 * b0) + (a3 * b1);
        this.c = (a0 * b2) + (a2 * b3);
        this.d = (a1 * b2) + (a3 * b3);
        this.tx = (a0 * b4) + (a2 * b5) + this.tx;
        this.ty = (a1 * b4) + (a3 * b5) + this.ty;

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
        const a0 = this.a;
        const a1 = this.b;
        const a2 = this.c;
        const a3 = this.d;
        const s = Math.sin(rad);
        const c = Math.cos(rad);

        this.a = (a0 * c) + (a2 * s);
        this.b = (a1 * c) + (a3 * s);
        this.c = (a0 * -s) + (a2 * c);
        this.d = (a1 * -s) + (a3 * c);

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
        const a0 = this.a;
        const a1 = this.b;
        const a2 = this.c;
        const a3 = this.d;

        this.a = a0 * x;
        this.b = a1 * x;
        this.c = a2 * y;
        this.d = a3 * y;

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
        this.tx = (this.a * x) + (this.c * y) + this.tx;
        this.ty = (this.b * x) + (this.d * y) + this.ty;

        return this;
    }

    /**
     * Returns a string representation of the matrix.
     *
     * @return {string} string representation of the matrix.
     */
    toString()
    {
        return `Matrix2d(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
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
                Math.pow(this.a, 2)
                + Math.pow(this.b, 2)
                + Math.pow(this.c, 2)
                + Math.pow(this.d, 2)
                + Math.pow(this.tx, 2)
                + Math.pow(this.ty, 2)
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
        this.a += b.a;
        this.b += b.b;
        this.c += b.c;
        this.d += b.d;
        this.tx += b.tx;
        this.ty += b.ty;

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
        this.a -= b.a;
        this.b -= b.b;
        this.c -= b.c;
        this.d -= b.d;
        this.tx -= b.tx;
        this.ty -= b.ty;

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
        this.a *= b;
        this.b *= b;
        this.c *= b;
        this.d *= b;
        this.tx *= b;
        this.ty *= b;

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
        this.a += (b.a * scale);
        this.b += (b.b * scale);
        this.c += (b.c * scale);
        this.d += (b.d * scale);
        this.tx += (b.tx * scale);
        this.ty += (b.ty * scale);

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
        return this.a === b.a
            && this.b === b.b
            && this.c === b.c
            && this.d === b.d
            && this.tx === b.tx
            && this.ty === b.ty;
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
        if (!b) return false;

        const a0 = this.a;
        const a1 = this.b;
        const a2 = this.c;
        const a3 = this.d;
        const a4 = this.tx;
        const a5 = this.ty;
        const b0 = b.a;
        const b1 = b.b;
        const b2 = b.c;
        const b3 = b.d;
        const b4 = b.tx;
        const b5 = b.ty;

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
