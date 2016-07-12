import Flags from '../util/Flags';
import BlendMode from '../util/BlendMode';

/**
 * @class
 */
export default class RenderState
{
    /**
     * @param {!Renderer} renderer - The renderer this object holds state for.
     */
    constructor(renderer)
    {
        /**
         * The renderer this object holds state for.
         *
         * @member {Renderer}
         */
        this.renderer = renderer;

        /**
         * Set of flags determining which features are active.
         *
         * @member {Flags}
         */
        this.stateFlags = RenderState.defaultStateFlags.clone();

        /**
         * The currently active blend mode.
         *
         * @member {BlendMode}
         */
        this.blendMode = null;

        /**
         * The currently active shader.
         *
         * @member {Shader}
         */
        this.shader = null;

        /**
         * The currently active render target.
         *
         * @member {RenderTarget}
         */
        this.target = null;

        /**
         * The maximum number of attributes this context can deal with.
         *
         * @member {number}
         */
        this.maxAttribs = this.renderer.gl.getParameter(this.renderer.gl.MAX_VERTEX_ATTRIBS);

        /**
         * Atribute state management.
         *
         * @member {object<string, boolean[]>}
         */
        this.attribState = {
            tempAttribState: new Array(this.maxAttribs),
            attribState: new Array(this.maxAttribs),
        };

        /**
         * The native VAO Extension if this context supports it.
         *
         * @member {*}
         */
        this.nativeVaoExtension = (
            this.renderer.gl.getExtension('OES_vertex_array_object')
            || this.renderer.gl.getExtension('MOZ_OES_vertex_array_object')
            || this.renderer.gl.getExtension('WEBKIT_OES_vertex_array_object')
        );
    }

    /**
     * Sets the given BlendMode as the active blend mode.
     *
     * @param {BlendMode} mode - A BlendMode instance to enable.
     * @param {boolean} force - Skip checks and always set value.
     * @return {boolean} True if the blend mode changed, false otherwise.
     */
    setBlendMode(mode, force = false)
    {
        const equal = this.blendMode ? this.blendMode.equals(mode) : this.blendMode === mode;

        if (!force && equal) return false;

        this.blendMode = mode;

        if (mode)
        {
            mode.enable(this.renderer.gl);
        }

        return true;
    }

    /**
     * Sets the given Shader as the active shader.
     *
     * @param {Shader} shader - A Shader instance to enable.
     * @param {boolean} force - Skip checks and always set value.
     * @return {boolean} True if the blend mode changed, false otherwise.
     */
    setShader(shader, force = false)
    {
        if (!force && this.shader === shader) return false;

        this.shader = shader;

        if (shader)
        {
            shader.bind();

            // automatically set the projection matrix
            if (this.target && shader.uniforms.uProjectionMatrix)
            {
                shader.uniforms.uProjectionMatrix = this.target.projectionMatrix.toMat3Array();
            }
        }
        else
        {
            this.renderer.gl.useProgram(null);
        }

        return true;
    }

    /**
     * Sets the given RenderTarget as the active target.
     *
     * @param {RenderTarget} target - A RenderTarget instance to enable.
     * @param {boolean} force - Skip checks and always set value.
     * @return {boolean} True if the blend mode changed, false otherwise.
     */
    setRenderTarget(target, force = false)
    {
        if (!force && this.target === target) return false;

        this.target = target;

        if (target)
        {
            target.activate();

            if (this.shader && this.shader.uniforms.uProjectionMatrix)
            {
                this.shader.uniforms.uProjectionMatrix = target.projectionMatrix.toMat3Array();
            }
        }

        return true;
    }

    /**
     * Sets whether gl.BLEND is enabled or not.
     *
     * @param {boolean} enabled - Whether or not to enable.
     * @return {boolean} True if the value changed, false otherwise.
     */
    enableBlend(enabled = true)
    {
        return this.enable(RenderState.FLAG.BLEND, enabled);
    }

    /**
     * Sets whether gl.DEPTH_TEST is enabled or not.
     *
     * @param {boolean} enabled - Whether or not to enable.
     * @return {boolean} True if the value changed, false otherwise.
     */
    enableDepthTest(enabled = true)
    {
        return this.enable(RenderState.FLAG.DEPTH_TEST, enabled);
    }

    /**
     * Sets whether gl.CULL_FACE is enabled or not.
     *
     * @param {boolean} enabled - Whether or not to enable.
     * @return {boolean} True if the value changed, false otherwise.
     */
    enableCullFace(enabled = true)
    {
        return this.enable(RenderState.FLAG.CULL_FACE, enabled);
    }

    /**
     * Sets whether gl.FRONT_FACE is enabled or not.
     *
     * @param {boolean} enabled - Whether or not to enable.
     * @return {boolean} True if the value changed, false otherwise.
     */
    enableFrontFace(enabled = true)
    {
        return this.enable(RenderState.FLAG.FRONT_FACE, enabled);
    }

    /**
     * Sets whether a feature is enabled or not.
     *
     * @param {number} flag - The flag to enable/disable.
     * @param {boolean} enabled - Whether or not to enable.
     * @param {boolean} force - Skip checks and always set value.
     * @return {boolean} True if the value changed, false otherwise.
     */
    enable(flag, enabled = true, force = false)
    {
        if (!force && this.stateFlags.is(flag, enabled))
        {
            return false;
        }

        this.stateFlags.set(flag, enabled);

        if (flag === RenderState.FLAG.FRONT_FACE)
        {
            if (enabled)
            {
                this.renderer.gl.frontFace(WebGLRenderingContext.CW);
            }
            else
            {
                this.renderer.gl.frontFace(WebGLRenderingContext.CCW);
            }
        }
        else
        {
            if (enabled)
            {
                this.renderer.gl.enable(RenderState.FLAG_GL_MAP[flag]);
            }
            else
            {
                this.renderer.gl.disable(RenderState.FLAG_GL_MAP[flag]);
            }
        }

        return true;
    }

    /**
     * Disables all vertex attribute arrays.
     *
     */
    resetAttributes()
    {
        for (let i = 0; i < this.maxAttribs; ++i)
        {
            this.attribState.tempAttribState[i] = false;
            this.attribState.attribState[i] = false;
        }

        // assume one is always active for performance reasons.
        for (let i = 1; i < this.maxAttribs; ++i)
        {
            this.renderer.gl.disableVertexAttribArray(i);
        }
    }

    /**
     * Resets the state and disables the VAOs.
     *
     */
    reset()
    {
        // unbind any VAO if they exist..
        if (this.nativeVaoExtension)
        {
            this.nativeVaoExtension.bindVertexArrayOES(null);
        }

        // reset all attributs..
        this.resetAttributes();

        // reset flipY
        this.renderer.gl.pixelStorei(this.renderer.gl.UNPACK_FLIP_Y_WEBGL, false);

        // force setting each state flag to default values
        Object.keys(RenderState.FLAG).forEach((k) =>
        {
            this.enable(RenderState.FLAG[k], RenderState.defaultStateFlags.isSet(RenderState.FLAG[k]), true);
        });

        // this.setBlendMode(BlendMode.NORMAL, true);
        this.setShader(null, true);
        this.setRenderTarget(null, true);
    }

    /**
     * Destroys the state data.
     */
    destroy()
    {
        this.reset();

        this.renderer = null;
        this.stateFlags = null;
        this.blendMode = null;
        this.shader = null;
        this.target = null;
        this.attribState = null;
        this.nativeVaoExtension = null;
    }
}

/**
 * Flags on state that enable/disable features
 *
 * @static
 * @constant
 * @memberof RenderState
 * @type {object}
 * @property {number} BLEND
 * @property {number} DEPTH_TEST
 * @property {number} FRONT_FACE
 * @property {number} CULL_FACE
 */
RenderState.FLAG = {
    BLEND:      Flags.F(0),
    DEPTH_TEST: Flags.F(1),
    FRONT_FACE: Flags.F(2),
    CULL_FACE:  Flags.F(3),
};

/**
 * Maps feature flags to the GL constant it represents.
 *
 * @static
 * @constant
 * @memberof RenderState
 * @type {object<number, number>}
 */
RenderState.FLAG_GL_MAP = {
    [RenderState.FLAG.BLEND]:       WebGLRenderingContext.BLEND,
    [RenderState.FLAG.DEPTH_TEST]:  WebGLRenderingContext.DEPTH_TEST,
    [RenderState.FLAG.FRONT_FACE]:  WebGLRenderingContext.FRONT_FACE,
    [RenderState.FLAG.CULL_FACE]:   WebGLRenderingContext.CULL_FACE,
};

RenderState.defaultStateFlags = new Flags(RenderState.FLAG.BLEND);
