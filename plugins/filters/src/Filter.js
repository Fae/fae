import { render, util } from '@fae/core';

const reservedUniforms = [
    '__data',               // reserved key from the parsing of uniforms in the GLShader
    'uSampler',             // reserved key as the input texture to a filter
    'uProjectionMatrix',    // reserved key as the precalculated projection matrix
];

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
         * The blend mode to be applied to the filter pass.
         *
         * @member {BlendMode}
         * @default BlendMode.NORMAL
         */
        this.blendMode = util.BlendMode.NORMAL;

        /**
         * The values for the uniforms of this filter. This object will contain a property
         * for each uniform, automatically detected from the shader source.
         *
         * Use this to set uniform values. *Do not* set values with
         * `filter.uniforms.<name> = ` as that will cause unexpected results.
         *
         * @member {*}
         */
        this.values = Filter.generateValueProperties(this.uniforms);
    }

    /**
     * Generates the values object with a key for each uniform.
     *
     * @param {*} uniforms - The uniforms to create a values object for.
     * @return {*} The values object.
     */
    static generateValueProperties(uniforms)
    {
        // TODO: Structs....

        const values = {};

        for (const k in uniforms)
        {
            // skip reserved names
            if (reservedUniforms.indexOf(k) !== -1) continue;

            values[k] = uniforms[k];
        }

        return values;
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

    /**
     * Should only be called after the filter has been set as the bound shader.
     * Since the FilterRenderSystem calls this for you, there should be almost
     * no situation where you should call this yourself.
     *
     */
    syncUniforms()
    {
        // TODO: Structs....

        // slot 0 is the main texture, additional textures start at 1
        let textureCount = 1;

        const values = this.values;
        const uniforms = this.uniforms;
        const uniformData = this.uniforms.__data;

        for (const k in values)
        {
            if (uniformData[k].type === 'sampler2D')
            {
                uniforms[k] = textureCount;

                // TextureSource object from the textures plugin
                // or anything that can give me a gl texture really.
                if (values[k].getGlTexture)
                {
                    const tx = values[k].getGlTexture(this.renderer);

                    if (tx) tx.bind(textureCount);
                }
                // Texture object from the textures plugin.
                else if (values[k].source && values[k].source.getGlTexture)
                {
                    const tx = values[k].source.getGlTexture(this.renderer);

                    if (tx) tx.bind(textureCount);
                }
                // RenderTarget, GLFramebuffer, or anything with a GLTexture property.
                else if (values[k].texture)
                {
                    values[k].texture.bind(textureCount);
                }

                textureCount++;
            }
            else if (uniformData[k].type === 'mat3')
            {
                // check if its a matrix object
                if (typeof values[k].a !== 'undefined')
                {
                    uniforms[k] = values[k].toArray(true);
                }
                else
                {
                    uniforms[k] = values[k];
                }
            }
            else if (uniformData[k].type === 'vec2')
            {
                // check if its a vector object
                if (typeof values[k].x !== 'undefined')
                {
                    const val = uniforms[k] || new Float32Array(2);

                    val[0] = values[k].x;
                    val[1] = values[k].y;

                    uniforms[k] = val;
                }
                else
                {
                    uniforms[k] = values[k];
                }
            }
            else
            {
                uniforms[k] = values[k];
            }
        }
    }
}

/**
 * @static
 * @constant
 * @memberof Filter
 * @type {string}
 */
Filter.defaultVertexSrc = require('./default.vert');
