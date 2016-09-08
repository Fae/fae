import { math } from '@fae/core';

/**
 * A simple class representing a polygon.
 *
 * @class
 * @memberof shapes
 */
export default class Polygon
{
    /**
     * Constructs a polygon.
     *
     * @param {Vector2d[]|number[]} points - This can be an array of `Vector2d`s that
     *  form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments
     *  passed can be all the points of the polygon e.g. `new Polygon(new Vector2d(), new Vector2d(), ...)`,
     *  or the arguments passed can be flat x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x`
     *  and `y` are Numbers.
     */
    constructor(...points)
    {
        // if the first param is an array, ignore the rest.
        if (Array.isArray(points[0])) points = points[0];

        // if this is an array of Vector2d, convert it to a flat array of numbers
        if (points[0] instanceof math.Vector2d)
        {
            const p = [];

            for (let i = 0; i < points.length; ++i)
            {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        /**
         * Whether or not this polygon is a "closed" polygon.
         *
         * @member {boolean}
         */
        this.closed = true;

        /**
         * An array of the points of this polygon
         *
         * @member {number[]}
         */
        this.points = points;
    }

    /**
     * Creates a clone of this polygon
     *
     * @return {Polygon} a copy of the polygon
     */
    clone()
    {
        return new Polygon(this.points.slice());
    }

    /**
     * Closes the polygon, adding points if necessary.
     */
    close()
    {
        const points = this.points;

        // close the poly if the value is true!
        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1])
        {
            points.push(points[0], points[1]);
        }
    }

    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this polygon
     */
    contains(x, y)
    {
        let inside = false;

        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        const length = this.points.length / 2;

        for (let i = 0, j = length - 1; i < length; j = i++)
        {
            const xi = this.points[i * 2];
            const yi = this.points[(i * 2) + 1];
            const xj = this.points[j * 2];
            const yj = this.points[(j * 2) + 1];

            const intersect = ((yi > y) !== (yj > y))
                && (x < (((xj - xi) * (y - yi)) / (yj - yi)) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;
    }

    /**
     * Checks if the passed polygon is equal to this one (has the same points).
     *
     * @param {Polygon} polygon - The polygon to check for equality.
     * @return {boolean} Whether polygons are equal.
     */
    equals(polygon)
    {
        if (!polygon || this.points.length !== polygon.points.length)
        {
            return false;
        }

        for (let i = 0; i < this.points.length; ++i)
        {
            if (this.points[i] !== polygon.points[i])
            {
                return false;
            }
        }

        return true;
    }
}

