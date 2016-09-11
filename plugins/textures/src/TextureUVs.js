/**
 * This file contains code that was taken from, or heavily based upon, code
 * from the pixi.js project. Those sections are used under the terms of The
 * Pixi License, detailed below:
 *
 * The Pixi License
 *
 * Copyright (c) 2013-2016 Mathew Groves
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Helper to store and calculate the UVs of a texture.
 *
 * @class
 * @memberof textures
 */
export default class TextureUVs
{
    /**
     *
     */
    constructor()
    {
        this.x0 = 0;
        this.y0 = 0;

        this.x1 = 1;
        this.y1 = 0;

        this.x2 = 1;
        this.y2 = 1;

        this.x3 = 0;
        this.y3 = 1;

        this.uvsUint32 = new Uint32Array(4);
    }

    /**
     * Calculates the UVs based on the given frames.
     *
     * @param {Rectangle} frame - The frame of the region in the texture.
     * @param {Rectangle} baseFrame - The frame of the full texture.
     * @param {number} rotation - Rotation of frame, in radians.
     * @private
     */
    set(frame, baseFrame, rotation)
    {
        const tw = baseFrame.width;
        const th = baseFrame.height;

        this.x0 = frame.x / tw;
        this.y0 = frame.y / th;

        this.x1 = (frame.x + frame.width) / tw;
        this.y1 = frame.y / th;

        this.x2 = (frame.x + frame.width) / tw;
        this.y2 = (frame.y + frame.height) / th;

        this.x3 = frame.x / tw;
        this.y3 = (frame.y + frame.height) / th;

        if (rotation)
        {
            // coordinates of center
            const cx = (frame.x / tw) + (frame.width / 2 / tw);
            const cy = (frame.y / th) + (frame.height / 2 / th);

            // rotation values
            const sr = Math.sin(rotation);
            const cr = Math.cos(rotation);

            this.x0 = cx + (((this.x0 - cx) * cr) - ((this.y0 - cy) * sr));
            this.y0 = cy + (((this.x0 - cx) * sr) + ((this.y0 - cy) * cr));

            this.x1 = cx + (((this.x1 - cx) * cr) - ((this.y1 - cy) * sr));
            this.y1 = cy + (((this.x1 - cx) * sr) + ((this.y1 - cy) * cr));

            this.x2 = cx + (((this.x2 - cx) * cr) - ((this.y2 - cy) * sr));
            this.y2 = cy + (((this.x2 - cx) * sr) + ((this.y2 - cy) * cr));

            this.x3 = cx + (((this.x3 - cx) * cr) - ((this.y3 - cy) * sr));
            this.y3 = cy + (((this.x3 - cx) * sr) + ((this.y3 - cy) * cr));
        }

        this.uvsUint32[0] = (((this.y0 * 65535) & 0xFFFF) << 16) | ((this.x0 * 65535) & 0xFFFF);
        this.uvsUint32[1] = (((this.y1 * 65535) & 0xFFFF) << 16) | ((this.x1 * 65535) & 0xFFFF);
        this.uvsUint32[2] = (((this.y2 * 65535) & 0xFFFF) << 16) | ((this.x2 * 65535) & 0xFFFF);
        this.uvsUint32[3] = (((this.y3 * 65535) & 0xFFFF) << 16) | ((this.x3 * 65535) & 0xFFFF);
    }
}
