import GLBuffer from './GLBuffer';
import GLVertexArrayObject from './GLVertexArrayObject';

/**
 * Helper class to create a quad
 *
 * @class
 * @memberof glutil
 */
export default class GLQuad
{
    /**
     * @param {WebGLRenderingContext} gl - The gl context for this quad to use.
     */
    constructor(gl)
    {
        /**
         * the current WebGL drawing context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * An array of vertices
         *
         * @member {Float32Array}
         */
        this.vertices = new Float32Array([
            -1, -1,
            1, -1,
            1, 1,
            -1, 1,
        ]);

        /**
         * The Uvs of the quad
         *
         * @member {Float32Array}
         */
        this.uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);

        /**
         * The array of data that actually gets uploaded.
         *
         * @member {Float32Array}
         */
        this.interleaved = new Float32Array(8 * 2);

        this.syncData();

        /**
         * An array containing the indices of the vertices
         *
         * @member {Uint16Array}
         */
        this.indices = GLQuad.createIndices(1);

        /**
         * The vertex buffer
         *
         * @member {GLBuffer}
         */
        this.vertexBuffer = GLBuffer.createVertexBuffer(gl, this.interleaved, gl.STATIC_DRAW);

        /**
         * The index buffer
         *
         * @member {GLBuffer}
         */
        this.indexBuffer = GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

        /**
         * The vertex array object that manages the buffers.
         *
         * @member {GLVertexArrayObject}
         */
        this.vao = new GLVertexArrayObject(gl);
    }

    /**
     * Utility to quickly create the indicies for a series of quads.
     *
     * @memberof util
     * @param {number} numQuads - Number of quads to create indices for.
     * @return {Uint16Array} The indices for the quad.
     */
    static createIndices(numQuads)
    {
        // the total number of indices in our array, there are 6 points per quad.
        const totalIndices = numQuads * 6;
        const indices = new Uint16Array(totalIndices);

        // fill the indices with the quads to draw
        for (let i = 0, j = 0; i < totalIndices; i += 6, j += 4)
        {
            indices[i + 0] = j + 0;
            indices[i + 1] = j + 1;
            indices[i + 2] = j + 2;
            indices[i + 3] = j + 0;
            indices[i + 4] = j + 2;
            indices[i + 5] = j + 3;
        }

        return indices;
    }

    /**
     * Initialises the vaos and uses the shader
     *
     * @param {GLShader} shader - The shader to use.
     */
    initVao(shader)
    {
        // TODO: https://github.com/pixijs/pixi.js/issues/2842
        // Dont try to deal with attributes the filter doesn't actually have
        this.vao.clear()
            .setIndexBuffer(this.indexBuffer)
            .addAttribute(this.vertexBuffer, shader.attributes.aVertexPosition, this.gl.FLOAT, false, 4 * 4, 0)
            .addAttribute(this.vertexBuffer, shader.attributes.aTextureCoord, this.gl.FLOAT, false, 4 * 4, 2 * 4);
    }

    /**
     * Synchronizes the data into the interleaved array.
     *
     */
    syncData()
    {
        for (let i = 0; i < 4; ++i)
        {
            const ix = i * 4;
            const vx = i * 2;

            this.interleaved[ix] = this.vertices[vx];
            this.interleaved[ix + 1] = this.vertices[vx + 1];
            this.interleaved[ix + 2] = this.uvs[vx];
            this.interleaved[ix + 3] = this.uvs[vx + 1];
        }
    }

    /**
     * Maps two Rectangle to the quad
     *
     * @param {Rectangle} targetTextureFrame - The first rectangle.
     * @param {Rectangle} destinationFrame - The second rectangle.
     * @return {GLQuad} Returns itself.
     */
    map(targetTextureFrame, destinationFrame)
    {
        let x = 0; // destinationFrame.x / targetTextureFrame.width;
        let y = 0; // destinationFrame.y / targetTextureFrame.height;

        this.uvs[0] = x;
        this.uvs[1] = y;

        this.uvs[2] = x + (destinationFrame.width / targetTextureFrame.width);
        this.uvs[3] = y;

        this.uvs[4] = x + (destinationFrame.width / targetTextureFrame.width);
        this.uvs[5] = y + (destinationFrame.height / targetTextureFrame.height);

        this.uvs[6] = x;
        this.uvs[7] = y + (destinationFrame.height / targetTextureFrame.height);

        x = destinationFrame.x;
        y = destinationFrame.y;

        this.vertices[0] = x;
        this.vertices[1] = y;

        this.vertices[2] = x + destinationFrame.width;
        this.vertices[3] = y;

        this.vertices[4] = x + destinationFrame.width;
        this.vertices[5] = y + destinationFrame.height;

        this.vertices[6] = x;
        this.vertices[7] = y + destinationFrame.height;

        return this;
    }

    /**
     * Draws the quad
     *
     * @return {GLQuad} Returns itself.
     */
    draw()
    {
        this.vao.bind()
            .draw(this.gl.TRIANGLES, 6, 0)
            .unbind();

        return this;
    }

    /**
     * Binds the buffer and uploads the data
     *
     * @return {GLQuad} Returns itself.
     */
    upload()
    {
        this.syncData();

        this.vertexBuffer.upload(this.interleaved);

        return this;
    }

    /**
     * Removes this quad from WebGL.
     *
     */
    destroy()
    {
        this.vertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.vao.destroy();

        this.gl = null;
        this.vertices = null;
        this.uvs = null;
        this.interleaved = null;
        this.indices = null;
    }
}
