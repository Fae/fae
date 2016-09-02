import { render } from '@fae/core';
import { Rectangle } from '@fae/shapes';
import bitTwiddle from 'bit-twiddle';

/**
 * @class
 */
class FilterState
{
    /**
     *
     */
    constructor()
    {
        this.renderTarget = null;
        this.sourceFrame = new Rectangle();
        this.destinationFrame = new Rectangle();
        this.entity = null;
        // this.resolution = 1;
    }
};

export default {
    getFilterState(entity, previousState, renderer, /*, resolution*/)
    {
        // prepare state
        const state = this._statePool.pop() || new FilterState();
        const bounds = entity.filterArea || entity.getBounds();

        state.entity = entity;

        if (!previousState)
        {
            state.sourceFrame.copy(renderer.state.target.size);
            state.destinationFrame.copy(renderer.state.target.size);
        }
        else
        {
            state.sourceFrame.copy(bounds);
            // state.sourceFrame.x = ((bounds.x * resolution) | 0) / resolution;
            // state.sourceFrame.y = ((bounds.y * resolution) | 0) / resolution;
            // state.sourceFrame.width = ((bounds.width * resolution) | 0) / resolution;
            // state.sourceFrame.height = ((bounds.height * resolution) | 0) / resolution;

            state.sourceFrame.fit(renderer.state.target.size);

            state.destinationFrame.x = state.destinationFrame.y = 0;
            state.destinationFrame.width = state.sourceFrame.width;
            state.destinationFrame.height = state.sourceFrame.height;

            state.sourceFrame.inflate(entity.filterPadding, entity.filterPadding);
        }

        // prepare render target
        const w = state.sourceFrame.width;
        const h = state.sourceFrame.height;
        const renderTarget = this._renderTargetPool.pop() || new render.RenderTarget(renderer.gl, w, h);

        w = bitTwiddle.nextPow2(w /* * resolution*/);
        h = bitTwiddle.nextPow2(h /* * resolution*/);

        renderTarget.resize(w, h);
        renderTarget.setFrame(state.destinationFrame, state.sourceFrame);

        state.renderTarget = renderTarget;

        return state;
    },
    freeFilterState(state)
    {
        this._statePool.push(state);
        this._renderTargetPool.push(state.renderTarget);
    },
    activeRenderStack: [],
    _renderTargetPool: [],
    _statePool: [],
};
