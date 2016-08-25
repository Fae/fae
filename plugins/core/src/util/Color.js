// @ifdef DEBUG
import { ASSERT } from '../debug';
// @endif

const rgxRgbString = /^rgba?\(([\d\.]+), ?([\d\.]+), ?([\d\.]+)(?:, ?([\d\.]+))\);?$/i;
const rgxHexShortString = /^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i;
const rgxHexFullString = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/**
 * Color container. Helps with constructing, converting, manipulating, and just
 * overall dealing with colors. Each component (r/g/b/a) are numbers in the range
 * [0...255].
 *
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
     * @param {boolean} normalized - Whether the values are normalized or not.
     */
    constructor(r = 0, g = 0, b = 0, normalized = false)
    {
        this.normalized = normalized;

        this._red = r;
        this._green = g;
        this._blue = b;
    }

    /**
     * Creates a color from a value in the form 0xRRGGBB.
     *
     * @param {number} num - The color value as a number.
     * @return {Color} The new color.
     */
    static fromRgb(num)
    {
        const c = new Color();

        c.rgb = num;

        return c;
    }

    /**
     * Creates a color from an array of RGB values.
     *
     * @param {number[]} components - The color components.
     * @param {boolean} normalized - Whether the values are normalized or not.
     * @return {Color} The new color.
     */
    static fromArray(components, normalized = false)
    {
        // @ifdef DEBUG
        ASSERT(components.length > 2, 'Component array passed to Color.fromArray() is too short.');
        // @endif
        const out = new Color(0, 0, 0, normalized);

        out.red = components[0];
        out.green = components[1];
        out.blue = components[2];

        return out;
    }

    /**
     * Creates a color from a string.
     *
     * @param {string} str - The string representation of this color. e.g. "#AABBCC" or "rgb(255, 255, 255)"
     * @return {Color} The new color.
     */
    static fromString(str)
    {
        const out = new Color();

        if (!str) return out;

        const firstChars = str.substring(0, 3);

        // assume "rgb()" or "rgba()" form
        if (firstChars === 'rgb')
        {
            const values = rgxRgbString.exec(str);

            if (values)
            {
                out.red = parseFloat(values[1], 10);
                out.green = parseFloat(values[2], 10);
                out.blue = parseFloat(values[3], 10);
            }
        }
        // assume hex form.
        else
        {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            str = str.replace(rgxHexShortString, (m, r, g, b) => (r + r + g + g + b + b));

            const values = rgxHexFullString.exec(str);

            if (values)
            {
                out.red = parseInt(values[1], 16);
                out.green = parseInt(values[2], 16);
                out.blue = parseInt(values[3], 16);
            }
        }

        return out;
    }

    /**
     * Creates a random color.
     *
     * @return {Color} The new color.
     */
    static randomColor()
    {
        const out = new Color();

        out.randomize();

        return out;
    }

    /**
     * The maximum value of a component.
     */
    get max()
    {
        return this.normalized ? 1 : 255;
    }

    /**
     * Value of the color as a number in 0xBBGGRR format.
     *
     * @member {number}
     */
    get bgr()
    {
        return this._red + (this._green << 8) + (this._blue << 16);
    }

    /**
     * Value of the color as a number in 0xRRGGBB format.
     *
     * @member {number}
     */
    get rgb()
    {
        return this.blue + (this.green << 8) + (this.red << 16);
    }

    /**
     * Set the value of the color from a number.
     *
     * @param {number} v - The value to set to.
     */
    set rgb(v)
    {
        // @ifdef DEBUG
        ASSERT(v >= 0 && v <= 0xffffff, `Value out of range for color: 0x${v.toString(16)} (min: 0, max: 0xffffff).`);
        // @endif

        const factor = this.normalized ? 255 : 1;

        this._red = (v >> 16) / factor;
        this._green = ((v & 0x00ff00) >> 8) / factor;
        this._blue = ((v & 0x0000ff)) / factor;
    }

    /**
     * Value of the red component of this color.
     *
     * @member {number}
     */
    get red()
    {
        return this._red;
    }

    /**
     * Set the value of the red component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set red(v)
    {
        // @ifdef DEBUG
        ASSERT(v >= 0 && v <= this.max, `Value out of range for RED component: ${v} (min: 0, max: ${this.max}).`);
        // @endif
        this._red = v;
    }

    /**
     * Value of the green component of this color.
     *
     * @member {number}
     */
    get green()
    {
        return this._green;
    }

    /**
     * Set the value of the green component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set green(v)
    {
        // @ifdef DEBUG
        ASSERT(v >= 0 && v <= this.max, `Value out of range for GREEN component: ${v} (min: 0, max: ${this.max}).`);
        // @endif
        this._green = v;
    }

    /**
     * Value of the blue component of this color.
     *
     * @member {number}
     */
    get blue()
    {
        return this._blue;
    }

    /**
     * Set the value of the blue component of this color.
     *
     * @param {number} v - The value to set to.
     */
    set blue(v)
    {
        // @ifdef DEBUG
        ASSERT(v >= 0 && v <= this.max, `Value out of range for BLUE component: ${v} (min: 0, max: ${this.max}).`);
        // @endif
        this._blue = v;
    }

    /**
     * Mixes this color with the passed one.
     *
     * @param {Color} color - The color to mix with.
     * @return {Color} returns itself.
     */
    mix(color)
    {
        this.red = (this.red + color.red) / 2;
        this.green = (this.green + color.green) / 2;
        this.blue = (this.blue + color.blue) / 2;

        return this;
    }

    /**
     * Randomizes the color components to create a random color.
     *
     * @param {number} alpha - An override for the alpha value, if set the color will use
     * this instead of a random value.
     * @return {Color} returns itself.
     */
    randomize()
    {
        this.red = Math.floor(Math.random() * (this.max + 1));
        this.green = Math.floor(Math.random() * (this.max + 1));
        this.blue = Math.floor(Math.random() * (this.max + 1));

        return this;
    }

    /**
     * Normalizes the color components.
     *
     * @return {Color} returns itself.
     */
    normalize()
    {
        if (!this.normalized)
        {
            this.red /= this.max;
            this.green /= this.max;
            this.blue /= this.max;

            this.normalized = true;
        }

        return this;
    }

    /**
     * Denormalizes the color components.
     *
     * @return {Color} returns itself.
     */
    denormalize()
    {
        if (this.normalized)
        {
            this.normalized = false;

            this.red *= this.max;
            this.green *= this.max;
            this.blue *= this.max;
        }

        return this;
    }

    /**
     * Creates a new color with the same values.
     *
     * @return {Color} The cloned color.
     */
    clone()
    {
        return new Color(this.red, this.green, this.blue, this.normalized);
    }

    /**
     * Copies another color's values into this one.
     *
     * @param {Color} color - The color to copy.
     * @return {Color} returns itself.
     */
    copy(color)
    {
        this.red = color.red;
        this.green = color.green;
        this.blue = color.blue;
        this.normalized = color.normalized;

        return this;
    }

    /**
     * Checks for equality with another color.
     *
     * @param {Color} color - The color to check equality against.
     * @param {boolean} ignoreAlpha -
     * @return {boolean} True if they are equal.
     */
    equals(color)
    {
        if (!color) return false;

        if (this.normalized !== color.normalized)
        {
            Color._tempColor.copy(color);
            color = Color._tempColor;

            if (this.normalized)
            {
                color.normalize();
            }
            else
            {
                color.denormalize();
            }
        }

        return this.red === color.red
            && this.green === color.green
            && this.blue === color.blue;
    }
}

Color.BLACK = new Color(0, 0, 0);
Color.WHITE = new Color(255, 255, 255);

Color.RED = new Color(255, 0, 0);
Color.GREEN = new Color(0, 255, 0);
Color.BLUE = new Color(0, 0, 255);

Color._tempColor = new Color();
