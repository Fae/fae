'use strict';

class VertexView
{
    /**
     * A VertexView provides easy access to a specific index in the VertexArray
     *
     * @param {VertexArray} array - The vertex array to access with this view.
     * @param {number} [index=0] - The index of the object to view
     */
    constructor(array, index = 0)
    {
        this.array = array;
        this.index = index;
    }

    set index(i)
    {
        this.positionIndex = i;
        i += this.array.positionSize;

        if (this.array.hasTexCoords)
        {
            this.texCoordIndex = i;
            i += Consts.COMPONENT_SIZE.TEX_COORDS;
        }

        if (this.array.hasColor)
        {
            this.colorIndex = i;
            i += Consts.COMPONENT_SIZE.COLOR;
        }

        if (this.array.hasNormals)
        {
            this.normalIndex = i;
            i += Consts.COMPONENT_SIZE.COLOR;
        }
    }

    get x() { return this.array[this.positionIndex]; }
    set x(v) { this.array[this.positionIndex] = v; }

    get y() { return this.array[this.positionIndex + 1]; }
    set y(v) { this.array[this.positionIndex + 1] = v; }

    get u() { return this.array[this.texCoordIndex]; }
    set u(v) { this.array[this.texCoordIndex] = v; }

    get v() { return this.array[this.texCoordIndex + 1]; }
    set v(v) { this.array[this.texCoordIndex + 1] = v; }

    get color() { return this.array[this.colorIndex]; }
    set color(v) { this.array[this.colorIndex] = v; }

    get normalX() { return this.array[this.normalIndex]; }
    set normalX(v) { this.array[this.normalIndex] = v; }

    get normalY() { return this.array[this.normalIndex + 1]; }
    set normalY(v) { this.array[this.normalIndex + 1] = v; }

    get normalZ() { return this.array[this.normalIndex + 2]; }
    set normalZ(v) { this.array[this.normalIndex + 2] = v; }
}
