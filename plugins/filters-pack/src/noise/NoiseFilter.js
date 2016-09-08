import { Filter } from '@fae/filters';

const fragSrc = require('./noise.frag');

/**
 * A Noise effect filter.
 *
 * @class
 * @memberof filters-pack
 */
export default class NoiseFilter extends Filter
{
    /**
     * @param {Renderer} renderer - The renderer this filter runs in.
     */
    constructor(renderer)
    {
        super(renderer, fragSrc);

        this.values.uNoise = 0.5;
    }
}
