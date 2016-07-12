/**
 * Helper to store and calculate the UVs of a texture.
 *
 * @class
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
