import { render } from '@fae/core';
import bitTwiddle from 'bit-twiddle';

export default {
    initialRenderTarget: null,
    activeRenderTarget: null,
    tempRenderTarget: null,
    setup(entity, renderer /* , resolution*/)
    {
        this.initialRenderTarget = renderer.state.target;

        if (!this.activeRenderTarget)
        {
            this.activeRenderTarget = new render.RenderTarget(renderer.gl, 1, 1);
        }

        if (!this.tempRenderTarget)
        {
            this.tempRenderTarget = new render.RenderTarget(renderer.gl, 1, 1);
        }

        // prepare state
        const bounds = entity.filterArea || entity.getBounds();
        const width = bitTwiddle.nextPow2(bounds.width);
        const height = bitTwiddle.nextPow2(bounds.height);

        this.activeRenderTarget.resize(width, height);
        this.tempRenderTarget.resize(width, height);

        renderer.state.setRenderTarget(this.activeRenderTarget);
    },
};
