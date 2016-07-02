/**
 * @class
 */
export default class Color
{
    /**
     * Creates a new color.
     *
     * @param {number} r - The red component.
     * @param {number} g - The green component.
     * @param {number} b - The blue component.
     * @param {number} a - The alpha component.
     */
    constructor(r = 0, g = 0, b = 0, a = 255)
    {
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    }

    /**
     * Value of the color (without alpha) as a number.
     *
     * @type {number}
     */
    get value()
    {
        return ((this[0] << 16) + (this[1] << 8) + this[2]);
    }

    /**
     * Set the value of the color (without alpha) from a number.
     *
     * @param {number} v - The value to set to.
     */
    set value(v)
    {
        this[0] = ((v >> 16) & 0xFF);
        this[1] = ((v >> 8) & 0xFF);
        this[2] = (v & 0xFF);
    }

    /**
     * Value of the red component of this color.
     *
     * @type {number}
     */
    get red()
    {
        return this[0];
    }

    /**
     * Set the value of the red component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set red(v)
    {
        this[0] = v;
    }

    /**
     * Value of the green component of this color.
     *
     * @type {number}
     */
    get green()
    {
        return this[1];
    }

    /**
     * Set the value of the green component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set green(v)
    {
        this[1] = v;
    }

    /**
     * Value of the blue component of this color.
     *
     * @type {number}
     */
    get blue()
    {
        return this[2];
    }

    /**
     * Set the value of the blue component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set blue(v)
    {
        this[2] = v;
    }

    /**
     * Value of the alpha component of this color.
     *
     * @type {number}
     */
    get alpha()
    {
        return this[3];
    }

    /**
     * Set the value of the alpha component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set alpha(v)
    {
        this[3] = v;
    }

    /**
     * Creates a new color with the same values.
     *
     * @return {Color} The cloned color.
     */
    clone()
    {
        return new Color(this[0], this[1], this[2], this[3]);
    }
}

Color.BLACK = new Color(0, 0, 0);
Color.WHITE = new Color(1, 1, 1);

Color.RED = new Color(1, 0, 0);
Color.GREEN = new Color(0, 1, 0);
Color.BLUE = new Color(0, 0, 1);

Color.TRANSPARENT = new Color(0, 0, 0, 0);
