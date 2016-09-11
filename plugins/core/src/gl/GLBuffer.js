/**
 * This file contains code that was taken from, or heavily based upon, code
 * from the pixi.js project. Those sections are used under the terms of The
 * Pixi License, detailed below:
 *
 * The Pixi License
 *
 * Copyright (c) 2013-2016 Mathew Groves
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
const EMPTY_ARRAY_BUFFER = new ArrayBuffer(0);

/**
 * Helper class to create a WebGL buffer.
 *
 * @class
 * @memberof glutil
 */
export default class GLBuffer
{
    /**
     * Creates a new GLBuffer.
     *
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {gl.ARRAY_BUFFER|gl.ELEMENT_ARRAY_BUFFER} type - Array type
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data
     * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType - Type of draw
     */
    constructor(gl, type = gl.ARRAY_BUFFER, data = EMPTY_ARRAY_BUFFER, drawType = gl.STATIC_DRAW)
    {
        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The WebGL buffer, created upon instantiation
         *
         * @member {WebGLBuffer}
         */
        this.buffer = gl.createBuffer();

        /**
         * The type of the buffer
         *
         * @member {gl.ARRAY_BUFFER|gl.ELEMENT_ARRAY_BUFFER}
         */
        this.type = type;

        /**
         * The draw type of the buffer
         *
         * @member {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW}
         */
        this.drawType = drawType;

        /**
         * The data in the buffer, as a typed array
         *
         * @member {ArrayBuffer|SharedArrayBuffer|ArrayBufferView}
         */
        this.data = EMPTY_ARRAY_BUFFER;

        // uplaod data if there is some
        if (data && data !== EMPTY_ARRAY_BUFFER)
        {
            this.upload(data);
        }
    }

    /**
     * Creates a new GLBuffer, using `gl.ARRAY_BUFFER` as the type.
     *
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data
     * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType - Type of draw
     * @return {GLBuffer} New buffer, using `gl.ARRAY_BUFFER` as the type
     */
    static createVertexBuffer(gl, data, drawType)
    {
        return new GLBuffer(gl, gl.ARRAY_BUFFER, data, drawType);
    }

    /**
     * Creates a new GLBuffer, using `gl.ELEMENT_ARRAY_BUFFER` as the type.
     *
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data
     * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType - Type of draw
     * @return {GLBuffer} New buffer, using `gl.ELEMENT_ARRAY_BUFFER` as the type
     */
    static createIndexBuffer(gl, data, drawType)
    {
        return new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, data, drawType);
    }

    /**
     * Uploads the buffer to the GPU
     *
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data to upload
     * @param {number} offset - if only a subset of the data should be uploaded, this is the amount of data to subtract
     * @param {boolean} dontBind - whether to bind the buffer before uploading it
     */
    upload(data = this.data, offset = 0, dontBind = false)
    {
        // todo - needed?
        if (!dontBind) this.bind();

        const gl = this.gl;

        if (this.data.byteLength >= data.byteLength)
        {
            gl.bufferSubData(this.type, offset, data);
        }
        else
        {
            gl.bufferData(this.type, data, this.drawType);
        }

        this.data = data;
    }

    /**
     * Binds the buffer
     *
     */
    bind()
    {
        this.gl.bindBuffer(this.type, this.buffer);
    }

    /**
     * Destroys the buffer
     *
     */
    destroy()
    {
        if (this.gl.isBuffer(this.buffer))
        {
            this.gl.deleteBuffer(this.buffer);
        }

        this.gl = null;
        this.buffer = null;
        this.data = null;
    }
}
