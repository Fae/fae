import { BoundsComponent } from './BoundsComponent';

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
