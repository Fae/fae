import Consts from './Consts.js';

// @ifdef DEBUG
import DEBUG from './debug';
// @endif

const C = Consts.COMPONENT_SIZE;

/**
 * @class
 */
export default class VertexArray
{
    /**
     * Create a new vertex array.
     *
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {!number} maxVertices - The maximum number of vertices allowed in the buffer.
     * @param {!number} maxIndices - The maximum number of vertices allowed in the buffer.
     * @param {number} [hasTexCoords=true] - Does the buffer contain color texture UV data?
     * @param {number} [hasColor=true] - Does the buffer contain color data?
     * @param {number} [hasNormals=false] - Does the buffer contain normal data?
     * @param {number} [use3D=false] - Does the buffer use 3D (x/y/z) position coords instead of 2D (x/y)?
     */
    constructor(gl, maxVertices, maxIndices, hasTexCoords = true, hasColor = true, hasNormals = false, use3D = false)
    {
        this.hasTexCoords = hasTexCoords;
        this.hasColor = hasColor;
        this.hasNormals = hasNormals;

        this.positionSize = (use3D ? C.POSITION_3D : C.POSITION_2D);

        this.vertexStride = this.positionSize + (hasColor ? C.COLOR : 0) +
            (hasTexCoords ? C.TEX_COORDS : 0) + (hasNormals ? C.NORMAL : 0);

        this.vertexByteSize = this.vertexStride * 4;

        this.vertices = new ArrayBuffer(this.vertexByteSize);
        this.indices = new Uint16Array(maxIndices);

        // create some views
        this.positions = new Float32Array(this.vertices);
        this.colors = new Uint32Array(this.vertices);

        this.setContext(gl);
    }

    /**
     * @param {!WebGLRenderingContext} gl - The rendering context.
     */
    setContext(gl)
    {
        this.gl = gl;

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }

    /**
     * Binds the buffer to the shader's attribute locations.
     *
     * @param {!number} aVertexPosition - The attribute index of the position attribute (vec2 or vec3 depending on use3D).
     * @param {!number} [aTextureCoord=-1] - The attribute index of the texture coord attribute (vec2).
     * @param {!number} [aColor=-1] - The attribute index of the color attribute (float).
     * @param {!number} [aNormals=-1] - The attribute index of the normals attribute (vec3).
     */
    bind(aVertexPosition, aTextureCoord = -1, aColor = -1, aNormals = -1)
    {
        DEBUG.ASSERT(this.hasTexCoords && aTextureCoord !== -1);

        let gl = this.gl;
        let stride = this.vertexByteSize;
        let offset = 0;

        // bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // bind position
        gl.vertexAttribPointer(aVertexPosition, this.positionSize, gl.FLOAT, false, stride, offset);
        offset += this.positionSize * 4;

        // bind texture coord
        if (this.hasTexCoords)
        {
            gl.vertexAttribPointer(aTextureCoord, C.TEX_COORDS, gl.FLOAT, false, stride, offset);
            offset += C.TEX_COORDS * 4;
        }

        // bind the color, we are interpretting the Uint32 color as 4 unsigned bytes
        if (this.hasColor)
        {
            gl.vertexAttribPointer(aColor, C.COLOR * 4, gl.UNSIGNED_BYTE, true, stride, offset);
            offset += C.COLOR * 4;
        }

        // bind the normals
        if (this.hasNormals)
        {
            gl.vertexAttribPointer(aNormals, C.NORMAL, gl.FLOAT, false, stride, offset);
            offset += C.NORMAL * 4;
        }
    }
}
