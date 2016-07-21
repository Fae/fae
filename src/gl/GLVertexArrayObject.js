import Device from 'ismobilejs';

/**
 * Helper class to work with WebGL GLVertexArrayObjects (vaos)
 * Only works if WebGL extensions are enabled (they usually are)
 *
 * @class
 */
export default class GLVertexArrayObject
{
    /**
     * @param {!WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {object} state - ??
     */
    constructor(gl, state)
    {
        this.nativeVaoExtension = null;

        if (!GLVertexArrayObject.FORCE_NATIVE)
        {
            this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object')
                                    || gl.getExtension('MOZ_OES_vertex_array_object')
                                    || gl.getExtension('WEBKIT_OES_vertex_array_object');
        }

        this.nativeState = state;

        if (this.nativeVaoExtension)
        {
            this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();

            const maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

            // VAO - overwrite the state..
            this.nativeState = {
                tempAttribState: new Array(maxAttribs),
                attribState: new Array(maxAttribs),
            };
        }

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * An array of attributes
         *
         * @member {Array}
         */
        this.attributes = [];

        /**
         * @member {Array}
         */
        this.indexBuffer = null;

        /**
         * A boolean flag
         *
         * @member {Boolean}
         */
        this.dirty = false;
    }

    /**
     * Binds the buffer
     *
     * @return {GLVertexArrayObject} Returns self.
     */
    bind()
    {
        if (this.nativeVao)
        {
            this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);

            if (this.dirty)
            {
                this.dirty = false;
                this.activate();
            }
        }
        else
        {
            this.activate();
        }

        return this;
    }

    /**
     * Unbinds the buffer
     *
     * @return {GLVertexArrayObject} Returns self.
     */
    unbind()
    {
        if (this.nativeVao)
        {
            this.nativeVaoExtension.bindVertexArrayOES(null);
        }

        return this;
    }

    /**
     * Uses this vao
     *
     * @return {GLVertexArrayObject} Returns self.
     */
    activate()
    {
        const gl = this.gl;
        let lastBuffer = null;

        for (let i = 0; i < this.attributes.length; ++i)
        {
            const attrib = this.attributes[i];

            if (lastBuffer !== attrib.buffer)
            {
                attrib.buffer.bind();
                lastBuffer = attrib.buffer;
            }

            attrib.attribute.setup(gl, attrib);
        }

        setVertexAttribArrays(gl, this.attributes, this.nativeState);

        this.indexBuffer.bind();

        return this;
    }

    /**
     * Add an attribute to the VAO
     *
     * @param {WebGLBuffer} buffer - The buffer for the attribute.
     * @param {object} attribute - The attribute descriptor from the shader.
     * @param {number} type - The GLEnum type of this attribute.
     * @param {boolean} normalized - Whether the value is normalized.
     * @param {number} stride - The size of a single element.
     * @param {number} start - The index in the buffer this attribute starts at.
     * @return {GLVertexArrayObject} Returns self.
     */
    addAttribute(buffer, attribute, type, normalized = false, stride = 0, start = 0)
    {
        this.attributes.push({
            buffer,
            attribute,
            type,
            normalized,
            stride,
            start,
        });

        this.dirty = true;

        return this;
    }

    /**
     * Adds an index into the VAO.
     *
     * @param {WebGLBuffer} buffer - The buffer to set as the index buffer.
     * @return {GLVertexArrayObject} Returns self.
     */
    setIndexBuffer(buffer)
    {
        this.indexBuffer = buffer;
        this.dirty = true;

        return this;
    }

    /**
     * Unbinds this vao and disables it
     *
     * @return {GLVertexArrayObject} Returns self.
     */
    clear()
    {
        // TODO - should this function unbind after clear?
        // for now, no but lets see what happens in the real world!
        if (this.nativeVao)
        {
            this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);
        }

        this.attributes.length = 0;
        this.indexBuffer = null;

        return this;
    }

    /**
     * Draws the VAO.
     *
     * @param {number} type - The draw type to use. Usually gl.TRIANGLES or gl.TRIANGLE_STRIP
     * @param {number} size - Size of the buffer to draw.
     * @param {number} start - Index to start.
     * @return {GLVertexArrayObject} Returns self.
     */
    draw(type, size, start = 0)
    {
        const gl = this.gl;

        gl.drawElements(type, size, gl.UNSIGNED_SHORT, start);

        return this;
    }

    /**
     * Destroy this vao
     */
    destroy()
    {
        // lose references
        this.gl = null;
        this.indexBuffer = null;
        this.attributes = null;
        this.nativeState = null;

        if (this.nativeVao)
        {
            this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao);
        }

        this.nativeVaoExtension = null;
        this.nativeVao = null;
    }
}

/**
 * Lets the VAO know if you should use the WebGL extension or the native methods.
 * Some devices behave a bit funny when using the newer extensions (im looking at you ipad 2!)
 * If you find on older devices that things have gone a bit weird then set this to true.
 *
 * This defaults to `true` for mobile devices and `false` for desktop.
 *
 * @static
 * @constant
 * @memberof GLVertexArrayObject
 * @type {boolean}
 * @default false
 */
GLVertexArrayObject.FORCE_NATIVE = Device.tablet || Device.phone;

/**
 * @param {!WebGLRenderingContext} gl - The current WebGL context
 * @param {object[]} attribs - attributes
 * @param {object} state - state
 */
function setVertexAttribArrays(gl, attribs, state)
{
    if (state)
    {
        const tempAttribState = state.tempAttribState;
        const attribState = state.attribState;

        for (let i = 0; i < tempAttribState.length; ++i)
        {
            tempAttribState[i] = false;
        }

        // set the new attribs
        for (let i = 0; i < attribs.length; ++i)
        {
            tempAttribState[attribs[i].attribute.location] = true;
        }

        for (let i = 0; i < attribState.length; ++i)
        {
            if (attribState[i] !== tempAttribState[i])
            {
                attribState[i] = tempAttribState[i];

                if (state.attribState[i])
                {
                    gl.enableVertexAttribArray(i);
                }
                else
                {
                    gl.disableVertexAttribArray(i);
                }
            }
        }
    }
    else
    {
        for (let i = 0; i < attribs.length; ++i)
        {
            gl.enableVertexAttribArray(attribs[i].attribute.location);
        }
    }
}
