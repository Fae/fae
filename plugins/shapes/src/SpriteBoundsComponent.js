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
import BoundsComponent from './BoundsComponent';

export default function SpriteBoundsComponent(Base)
{
    /**
     * Component that adds sprite bounds calculations for sprite assemblages that also
     * want to include the BoundsComponent.
     *
     * @class SpriteBoundsComponent
     * @memberof sprites
     */
    return class extends BoundsComponent(Base)
    {
        /**
         * Updates the bounds of this sprite.
         *
         * @private
         */
        _updateBounds()
        {
            this._bounds.clear();

            if (!this.visible || !this._texture || !this._texture.ready) return;

            const trim = this._texture.trim;
            const orig = this._texture.orig;

            if (!trim || (trim.width === orig.width && trim.height === orig.height))
            {
                this._bounds.addQuad(this.vertexData);
            }
            else
            {
                const wt = this.transform.worldTransform;
                const a = wt.a;
                const b = wt.b;
                const c = wt.c;
                const d = wt.d;
                const tx = wt.tx;
                const ty = wt.ty;

                const w0 = (orig.width) * (1 - this._anchorX);
                const w1 = (orig.width) * -this._anchorX;

                const h0 = orig.height * (1 - this._anchorY);
                const h1 = orig.height * -this._anchorY;

                this._bounds.addQuad([
                    (a * w1) + (c * h1) + tx,
                    (d * h1) + (b * w1) + ty,

                    (a * w0) + (c * h1) + tx,
                    (d * h1) + (b * w0) + ty,

                    (a * w0) + (c * h0) + tx,
                    (d * h0) + (b * w0) + ty,

                    (a * w1) + (c * h0) + tx,
                    (d * h0) + (b * w1) + ty,
                ]);
            }
        }
    };
}
