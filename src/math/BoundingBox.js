import Rectangle from './Rectangle';

/**
 * BoundingBox is an axis-aligned bounding box for an owning object.
 *
 * @class
 */
export default class BoundingBox extends Rectangle
{
    /**
     *
     */
    constructor()
    {
        super();

        /**
         * Tracks the "empty" bounds state so we always have a valid rectangle.
         *
         * @member {boolean}
         */
        this._empty = true;
    }

    /**
     * Resets the bounding box to a default empty box.
     *
     */
    clear()
    {
        this.x = this.y = this.width = this.height = 0;
        this._empty = true;
    }

    /**
     * Adds the child bounds object to the size of this bounding box.
     *
     * @param {BoundingBox} bounds - The child bounds to include.
     * @return {BoundingBox} Returns itself.
     */
    addChild(bounds)
    {
        if (bounds._empty) return this;

        if (this._empty)
        {
            this.copy(bounds);
            this._empty = false;
        }
        else
        {
            this.union(bounds);
        }

        return this;
    }

    /**
     * Adds the vertices of a quad to the size of this bounding box. This
     * has the effect of extending the bounding box to include this quad.
     *
     * @param {Float32Array|number[]} vertices - The vertices of the quad.
     * @return {BoundingBox} Returns itself.
     */
    addQuad(vertices)
    {
        let minX = this._empty ? Infinity : this.x;
        let minY = this._empty ? Infinity : this.y;
        let maxX = this._empty ? -Infinity : this.right;
        let maxY = this._empty ? -Infinity : this.bottom;

        let x = 0;
        let y = 0;

        x = vertices[0];
        y = vertices[1];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[2];
        y = vertices[3];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[4];
        y = vertices[5];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[6];
        y = vertices[7];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.x = minX;
        this.y = minY;
        this.width = maxX - this.x;
        this.height = maxY - this.y;

        this._empty = false;

        return this;
    }

    /**
     * Adds an arbitrary array of vertices to the size of the bounding box.
     *
     * @param {Transform} transform - The transform to consider.
     * @param {Float32Array|number[]} vertices - The vertices to consider.
     * @param {number} offset - offset into the vertices array to start at.
     * @param {number} endOffset - The end of the vertices at which to stop.
     * @return {BoundingBox} Returns itself.
     */
    addVertices(transform, vertices, offset = 0, endOffset = vertices.length)
    {
        const matrix = transform.worldTransform;

        const a = matrix.a;
        const b = matrix.b;
        const c = matrix.c;
        const d = matrix.d;
        const tx = matrix.tx;
        const ty = matrix.ty;

        let minX = this._empty ? Infinity : this.x;
        let minY = this._empty ? Infinity : this.y;
        let maxX = this._empty ? -Infinity : this.right;
        let maxY = this._empty ? -Infinity : this.bottom;

        for (let i = offset; i < endOffset; i += 2)
        {
            const rawX = vertices[i];
            const rawY = vertices[i + 1];

            const x = (a * rawX) + (c * rawY) + tx;
            const y = (d * rawY) + (b * rawX) + ty;

            minX = Math.min(x, minX);
            minY = Math.min(y, minY);
            maxX = Math.max(x, maxX);
            maxY = Math.max(y, maxY);
        }

        this.x = minX;
        this.y = minY;
        this.wight = maxX - this.x;
        this.height = maxY - this.y;

        this._empty = false;

        return this;
    }
}
