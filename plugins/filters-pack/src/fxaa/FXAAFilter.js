import { Filter } from '@fae/filters';

const vertSrc = require('./fxaa.vert');
const fragSrc = require('./fxaa.frag');

/**
 * Basic FXAA implementation based on the code on geeks3d.com with the
 * modification that the texture2DLod stuff was removed since it's
 * unsupported by WebGL.
 *
 * @see https://github.com/mitsuhiko/webgl-meincraft
 *
 * @class
 */
export default class FXAAFilter extends Filter
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     */
    constructor(renderer)
    {
        super(renderer, fragSrc, vertSrc);
    }
}
