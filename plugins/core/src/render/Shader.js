import GLShader from '../gl/GLShader';

/**
 * Shader wrapper.
 *
 * @class
 */
export default class Shader extends GLShader
{
    /**
     * Constructs a new Shader.
     *
     * @param {!WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {!string} vertexSrc - The vertex shader source as an array of strings.
     * @param {!string} fragmentSrc - The fragment shader source as an array of strings.
     */
    constructor(gl, vertexSrc, fragmentSrc)
    {
        super(gl, checkPrecision(vertexSrc), checkPrecision(fragmentSrc));
    }
}

/**
 * Ensures that the source of the program has precision specified.
 *
 * @param {string} source - The source to check.
 * @return {string} The potentially modified source.
 */
function checkPrecision(source)
{
    const lines = source.split('\n');

    let commentOpen = false;

    for (let i = 0; i < lines.length; ++i)
    {
        const line = lines[i].trim();
        const firstChars = line.substring(0, 2);

        // line comment, ignore
        if (firstChars === '//') continue;

        // start of block comment, set flag
        if (firstChars === '/*')
        {
            commentOpen = true;
        }

        // if comment open, check if this line ends it. If not continue
        if (commentOpen)
        {
            if (line.indexOf('*/') !== -1)
            {
                commentOpen = false;
            }

            continue;
        }

        // not in a comment, check if precision is set
        if (line.substring(0, 9) !== 'precision')
        {
            return `precision ${Shader.PRECISION.DEFAULT} float;\n\n${source}`;
        }
    }

    return source;
}

/**
 * Value that specifies float precision in shaders.
 *
 * @static
 * @constant
 * @memberof Shader
 * @type {object}
 * @property {string} DEFAULT=MEDIUM - The default precision to use.
 * @property {string} LOW - The low precision header.
 * @property {string} MEDIUM - The medium precision header.
 * @property {string} HIGH - The high precision header.
 */
Shader.PRECISION = {
    DEFAULT:    'highp',
    LOW:        'lowp',
    MEDIUM:     'mediump',
    HIGH:       'highp',
};
