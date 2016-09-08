import { render, util } from '@fae/core';

/**
 * @class
 * @memberof filters
 */
export default class Filter extends render.Shader
{
    /**
     * @param {Renderer} renderer - The renderer instance of the filter.
     * @param {string} fragmentSrc - The source of the fragment shader for this filter.
     * @param {string} vertexSrc - The source of the vertex shader for this filter.
     */
    constructor(renderer, fragmentSrc, vertexSrc = Filter.defaultVertexSrc)
    {
        super(renderer, vertexSrc, fragmentSrc);

        /**
         * Whether or not this filter is currently enabled. This is useful
         * if you need to turn on/off a filter often and don't want to change
         * an Entity's `filters` array.
         *
         * @member {boolean}
         * @default true
         */
        this.enable = true;

        /**
         * The string source of the vertex shader.
         *
         * @member {string}
         */
        this.vertexSrc = vertexSrc;

        /**
         * The string source of the fragment shader.
         *
         * @member {string}
         */
        this.fragmentSrc = fragmentSrc;

        /**
         * The blend mode to be applied to the filter pass.
         *
         * @member {BlendMode}
         * @default BlendMode.NORMAL
         */
        this.blendMode = util.BlendMode.NORMAL;
    }

    /**
     * @param {FilterRenderSystem} system - The render system.
     * @param {RenderTarget} input - The render target to use as input.
     * @param {RenderTarget} output - The render target to use as output.
     * @param {boolean} clear - Should the output buffer be cleared before use?
     */
    run(system, input, output, clear)
    {
        system.drawFilter(this, input, output, clear);
    }
}

/**
 * @static
 * @constant
 * @memberof Filter
 * @type {string}
 */
Filter.defaultVertexSrc = require('./default.vert');
