'use strict';

export default class Color {

    constructor(r, g, b, a)
    {
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    }

    get value()
    {
        return ((this[0] << 16) + (this[1] << 8) + this[2]);
    }

    set value(v)
    {
        this[0] = (v >> 16 & 0xFF);
        this[1] = (v >> 8 & 0xFF);
        this[2] = (v & 0xFF);
    }

    get red() { return this[0]; }
    set red(v) { this[0] = v; }

    get green() { return this[1]; }
    set green(v) { this[1] = v; }

    get blue() { return this[2]; }
    set blue(v) { this[2] = v; }

    get alpha() { return this[3]; }
    set alpha(v) { this[3] = v; }

}

Color.BLACK = new Color(0, 0, 0, 255);
Color.WHITE = new Color(1, 1, 1, 255);

Color.RED = new Color(1, 0, 0, 255);
Color.GREEN = new Color(0, 1, 0, 255);
Color.BLUE = new Color(0, 0, 1, 255);
