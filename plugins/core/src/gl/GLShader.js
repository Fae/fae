import { GL_SIZE_MAP, GL_SETTER, GL_ARRAY_SETTER, getUniformDefault } from './GLData';
import GLProgramCache from './GLProgramCache';

// @ifdef DEBUG
import { ASSERT } from '../debug';
// @endif

/**
 * Helper class to create a webGL Shader
 *
 * @class
 */
export default class GLShader
{
    /**
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {string|string[]} vertexSrc - The vertex shader source as an array of strings.
     * @param {string|string[]} fragmentSrc - The fragment shader source as an array of strings.
     */
    constructor(gl, vertexSrc, fragmentSrc)
    {
        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The vertex shader source of the program.
         *
         * @member {string}
         */
        this.vertexSrc = vertexSrc;

        /**
         * The fragment shader source of the program.
         *
         * @member {string}
         */
        this.fragmentSrc = fragmentSrc;

        /**
         * The shader program
         *
         * @member {WebGLProgram}
         */
        this.program = null;

        /**
         * The attributes of the shader as an object containing the following properties
         * {
         * 	type,
         * 	size,
         * 	location,
         * 	pointer
         * }
         * @member {Object}
         */
        this.attributes = null;

        /**
         * The uniforms of the shader as an object containing the following properties
         * {
         * 	gl,
         * 	data
         * }
         * @member {Object}
         */
        this.uniforms = null;

        // initialize
        this.recompile();
    }

    /**
     * Compiles source into a program.
     *
     * @static
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {string} vertexSrc - The vertex shader source as an array of strings.
     * @param {string} fragmentSrc - The fragment shader source as an array of strings.
     * @param {boolean} [forceCompile=false] - When set to true this will always compile,
     *  skipping the cache checks
     * @return {WebGLProgram} the shader program
     */
    static compileProgram(gl, vertexSrc, fragmentSrc, forceCompile)
    {
        const cacheKey = GLProgramCache.key(vertexSrc, fragmentSrc);
        const cachedProgram = GLProgramCache.get(cacheKey);

        if (!forceCompile && cachedProgram)
        {
            return cachedProgram;
        }

        const glVertShader = GLShader.compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
        const glFragShader = GLShader.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

        let program = gl.createProgram();

        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);
        gl.linkProgram(program);

        // @ifdef DEBUG

        // if linking fails, then log and cleanup
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            ASSERT(false, `Could not initialize shader.
gl.VALIDATE_STATUS: ${gl.getProgramParameter(program, gl.VALIDATE_STATUS)}
gl.getError(): ${gl.getError()}
gl.getProgramInfoLog(): ${gl.getProgramInfoLog(program)}
            `);

            gl.deleteProgram(program);

            program = null;
        }

        // @endif

        // clean up some shaders
        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);

        if (program)
        {
            GLProgramCache.set(cacheKey, program);
        }

        return program;
    }

    /**
     * Compiles source into a program.
     *
     * @static
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {number} type - The type, can be either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
     * @param {string} source - The fragment shader source as an array of strings.
     * @return {WebGLShader} the shader
     */
    static compileShader(gl, type, source)
    {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // @ifdef DEBUG

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            ASSERT(false, `Failed to compile shader.
gl.COMPILE_STATUS: ${gl.getShaderParameter(shader, gl.COMPILE_STATUS)}
gl.getShaderInfoLog(): ${gl.getShaderInfoLog(shader)}
            `);

            return null;
        }

        // @endif

        return shader;
    }

    /**
     * Extracts the attributes
     *
     * @static
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {WebGLProgram} program - The shader program to get the attributes from
     * @return {object} attributes
     */
    static extractAttributes(gl, program)
    {
        const attributes = {};

        const totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < totalAttributes; ++i)
        {
            const attribData = gl.getActiveAttrib(program, i);

            // @ifdef DEBUG
            ASSERT(GL_SIZE_MAP[attribData.type], 'Unknown attribute type, unable to determine size.');
            // @endif

            attributes[attribData.name] = {
                type: attribData.type,
                size: GL_SIZE_MAP[attribData.type],
                location: gl.getAttribLocation(program, attribData.name),
                setup: attributeSetupFunction,
            };
        }

        return attributes;
    }

    /**
     * Extracts the uniforms
     *
     * @static
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {WebGLProgram} program - The shader program to get the uniforms from
     * @return {object} uniforms
     */
    static extractUniforms(gl, program)
    {
        const uniforms = {};

        const totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < totalUniforms; ++i)
        {
            const uniformData = gl.getActiveUniform(program, i);
            const name = uniformData.name.replace(/\[.*?\]/, '');

            uniforms[name] = {
                type: uniformData.type,
                size: uniformData.size,
                location: gl.getUniformLocation(program, name),
                value: getUniformDefault(uniformData),
            };
        }

        return uniforms;
    }

    /**
     * Extracts the uniforms
     *
     * @static
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {!object} uniformData - The uniform data to create an access object for.
     * @return {object} uniform access object.
     */
    static generateUniformAccessObject(gl, uniformData)
    {
        // this is the object we will be sending back.
        // an object hierachy will be created for structs
        const uniforms = {
            data: {},
        };

        const uniformKeys = Object.keys(uniformData);

        for (let i = 0; i < uniformKeys.length; ++i)
        {
            const fullName = uniformKeys[i];

            const nameTokens = fullName.split('.');
            const name = nameTokens[nameTokens.length - 1];

            const uniformGroup = getUniformGroup(nameTokens, uniforms);
            const uniform = uniformData[fullName];

            uniformGroup.data[name] = uniform;

            uniformGroup.gl = gl;

            Reflect.defineProperty(uniformGroup, name, {
                get: () => uniformGroup.data[name].value,
                set: (value) =>
                {
                    uniformGroup.data[name].value = value;

                    const loc = uniformGroup.data[name].location;

                    if (uniform.size === 1)
                    {
                        GL_SETTER[uniform.type](gl, loc, value);
                    }
                    else
                    {
                        GL_ARRAY_SETTER[uniform.type](gl, loc, value);
                    }
                },
            });
        }

        return uniforms;
    }

    /**
     * Recompiles the shader program.
     *
     * @param {boolean} [forceCompile=false] - When set to true this will always compile,
     *  skipping the cache checks.
     */
    recompile(forceCompile)
    {
        this.program = GLShader.compileProgram(this.gl, this.vertexSrc, this.fragmentSrc, forceCompile);
        this.attributes = GLShader.extractAttributes(this.gl, this.program);
        this.uniforms = GLShader.generateUniformAccessObject(this.gl, GLShader.extractUniforms(this.gl, this.program));
    }

    /**
     * Uses this shader
     */
    bind()
    {
        this.gl.useProgram(this.program);
    }

    /**
     * Destroys this shader
     * TODO
     */
    destroy()
    {
        // var gl = this.gl;
    }
}

function attributeSetupFunction(gl, attrib)
{
    return gl.vertexAttribPointer(
        this.location,
        this.size,
        attrib.type || this.type,
        attrib.normalized || false,
        attrib.stride || 0,
        attrib.start || 0
    );
}

function getUniformGroup(nameTokens, uniform)
{
    let cur = uniform;

    for (let i = 0; i < nameTokens.length - 1; ++i)
    {
        const o = cur[nameTokens[i]] || { data: {} };

        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
}
