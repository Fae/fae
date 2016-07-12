import Device from 'ismobilejs';
import bitTwiddle from 'bit-twiddle';
import { Renderer, ObjectRenderer, Shader, glutil, util/* @ifdef DEBUG */, debug/* @endif */ } from '@fay/core';

const vertSource = require('./shader/multi-texture.vert');
const fragTemplate = require('./shader/multi-texture.frag');

/**
 * @class
 */
export default class SpriteRenderer extends ObjectRenderer
{
    /**
     * @param {Renderer} renderer - The renderer this manager works for.
     */
    constructor(renderer)
    {
        super(renderer);

        /**
         * Number of values sent in the vertex buffer.
         * positionX, positionY, colorR, colorG, colorB = 5
         *
         * @member {number}
         */
        this.vertSize = 5;

        /**
         * The size of the vertex information in bytes.
         *
         * @member {number}
         */
        this.vertByteSize = this.vertSize * 4;

        /**
         * The number of images in the SpriteBatch before it flushes.
         *
         * @member {number}
         */
        this.size = bitTwiddle.nextPow2(SpriteRenderer.DEFAULT_SPRITE_BATCH_SIZE);

        /**
         * Buffer views used to upload smaller portions of the data size when the
         * batch is small. This removes the need for `.subarray()`.
         *
         * @member {Buffer[]}
         */
        this.buffers = [];

        /**
         * Raw ArrayBuffer used to store all the buffers in.
         *
         * @private
         * @member {ArrayBuffer}
         */
        this._buffersMem = new ArrayBuffer(this.size * 4 * this.vertByteSize);

        /**
         * Holds the indices of the geometry (quads) to draw
         *
         * @member {Uint16Array}
         */
        this.indices = util.createIndicesForQuads(this.size);

        /**
         * The default shaders that is used if a sprite doesn't have a more specific one.
         * there is a shader for each number of textures that can be rendererd.
         * These shaders will also be generated on the fly as required.
         *
         * @member {Shader}
         */
        this.shaders = null;

        // create buffer views
        for (let i = 1; i <= this.size; i *= 2)
        {
            const viewSize = i * 4 * this.vertByteSize;

            this.buffers.push(new util.Buffer(this._buffersMem, 0, viewSize));
        }

        this.currentIndex = 0;
        this.tick = 0;
        this.groups = [];

        for (let k = 0; k < this.size; ++k)
        {
            this.groups[k] = {
                textures: [],
                size: 0,
                start: 0,
                blend: null,
            };
        }

        this.sprites = [];

        this.startNumVaos = 2;
        this.vertexBuffers = [];
        this.vaos = [];

        this.vertexCount = 0;

        this.indexBuffer = null;

        this.vao = null;
        this.currentBlendMode = null;

        this._maxTextures = 0;
        this._onBeforeRenderBinding = this.renderer.onBeforeRender.add(this.onBeforeRender, this);
    }

    /**
     * Called by base Manager class when there is a WebGL context change.
     *
     */
    onContextChange()
    {
        const gl = this.renderer.gl;

        // step 1: first check max textures the GPU can handle.
        this._maxTextures = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), SpriteRenderer.MAX_TEXTURE_COUNT);

        // step 2: check the maximum number of if statements the shader can have too..
        this._maxTextures = util.getMaxIfStatmentsInShader(gl, this._maxTextures);

        this.shaders = new Array(this._maxTextures);
        this.shaders[0] = generateMultiTextureShader(gl, 1);
        this.shaders[1] = generateMultiTextureShader(gl, 2);

        // create a couple of buffers
        this.indexBuffer = glutil.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

        // we use the second shader as the first one depending on your browser may omit aTextureId
        // as it is not used by the shader so is optimized out.
        const attribs = this.shaders[1].attributes;
        const maxVaos = this.vertexBuffers.length || this.startNumVaos;

        for (let i = 0; i < maxVaos; ++i)
        {
            this._createVao(gl, attribs);
        }

        this.vao = this.vaos[0];
        this.currentBlendMode = null;
    }

    /**
     * Called just before the renderer starts rendering.
     *
     */
    onBeforeRender()
    {
        this.vertexCount = 0;
    }

    /**
     * Starts a new sprite batch.
     *
     */
    start()
    {
        this.tick %= 1000;
    }

    /**
     * Stops the sprite batch.
     *
     */
    stop()
    {
        this.flush();
        this.vao.unbind();
    }

    /**
     * Renders the content and empties the current batch.
     *
     */
    flush()
    {
        if (this.currentIndex === 0) return;

        const gl = this.renderer.gl;

        const np2 = bitTwiddle.nextPow2(this.currentIndex);
        const log2 = bitTwiddle.log2(np2);
        const buffer = this.buffers[log2];

        let index = 0;
        let nextTexture = null;
        let currentTexture = null;
        let groupCount = 1;
        let textureCount = 0;
        let currentGroup = this.groups[0];
        let blendMode = this.sprites[0].blendMode || util.BlendMode.NORMAL;

        currentGroup.textures.length = 0;
        currentGroup.start = 0;
        currentGroup.blend = blendMode;

        this.tick++;

        for (let i = 0; i < this.currentIndex; ++i)
        {
            // upload the sprite elemetns...
            // they have all ready been calculated so we just need to push them into the buffer.
            const sprite = this.sprites[i];

            nextTexture = sprite._texture.source;

            if (!blendMode.equals(sprite.blendMode))
            {
                blendMode = sprite.blendMode;

                // force the batch to break!
                currentTexture = null;
                textureCount = this._maxTextures;
                this.tick++;
            }

            if (currentTexture !== nextTexture)
            {
                currentTexture = nextTexture;

                if (nextTexture._enabled !== this.tick)
                {
                    if (textureCount === this._maxTextures)
                    {
                        this.tick++;

                        textureCount = 0;

                        currentGroup.size = i - currentGroup.start;

                        currentGroup = this.groups[groupCount++];
                        currentGroup.textures.length = 0;
                        currentGroup.blend = blendMode;
                        currentGroup.start = i;
                    }

                    nextTexture._enabled = this.tick;
                    nextTexture._id = textureCount;

                    currentGroup.textures.push(nextTexture.getGlTexture(this.renderer));
                    textureCount++;
                }
            }

            // TODO: this sum does not need to be set each frame, dirty flag?
            const tint = sprite.tint.bgr + (sprite.worldAlpha * 255 << 24);
            const uvs = sprite._texture._uvs.uvsUint32;
            const textureId = nextTexture._id;
            const vertexData = sprite.vertexData;

            // xy
            buffer.float32View[index++] = vertexData[0];
            buffer.float32View[index++] = vertexData[1];
            buffer.uint32View[index++] = uvs[0];
            buffer.uint32View[index++] = tint;
            buffer.float32View[index++] = textureId;

            // xy
            buffer.float32View[index++] = vertexData[2];
            buffer.float32View[index++] = vertexData[3];
            buffer.uint32View[index++] = uvs[1];
            buffer.uint32View[index++] = tint;
            buffer.float32View[index++] = textureId;

            // xy
            buffer.float32View[index++] = vertexData[4];
            buffer.float32View[index++] = vertexData[5];
            buffer.uint32View[index++] = uvs[2];
            buffer.uint32View[index++] = tint;
            buffer.float32View[index++] = textureId;

            // xy
            buffer.float32View[index++] = vertexData[6];
            buffer.float32View[index++] = vertexData[7];
            buffer.uint32View[index++] = uvs[3];
            buffer.uint32View[index++] = tint;
            buffer.float32View[index++] = textureId;
        }

        currentGroup.size = (this.currentIndex - 1) - currentGroup.start;

        this.vertexCount++;

        if (this.vertexBuffers.length <= this.vertexCount)
        {
            this._createVao(this.shaders[1].attributes);
        }

        // @ifdef DEBUG
        debug.ASSERT(this.vertexBuffers.length > this.vertexCount, 'Number of Vertex Buffers is too small.');
        // @endif

        this.vertexBuffers[this.vertexCount].upload(buffer.bytes, 0);
        this.vao = this.vaos[this.vertexCount].bind();

        // render the groups..
        for (let i = 0; i < groupCount; ++i)
        {
            const group = this.groups[i];
            const groupTextureCount = group.textures.length;

            let shader = this.shaders[groupTextureCount - 1];

            if (!shader)
            {
                shader = this.shaders[groupTextureCount - 1] = generateMultiTextureShader(gl, groupTextureCount);
            }

            this.renderer.state.setShader(shader);

            for (let j = 0; j < groupTextureCount; ++j)
            {
                group.textures[j].bind(j);
            }

            // set the blend mode..
            this.renderer.state.setBlendMode(group.blend);

            gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
        }

        // reset elements for the next flush
        this.currentIndex = 0;
    }

    /**
     * Renders the sprite object.
     *
     * @param {Sprite} sprite - the sprite to render.
     */
    render(sprite)
    {
        if (this.currentIndex >= this.size)
        {
            this.flush();
        }

        // if the uvs have not updated then no point rendering just yet!
        if (!sprite.texture._uvs)
        {
            return;
        }

        // increment the batchsize
        this.sprites[this.currentIndex++] = sprite;
    }

    /**
     * Destroys the sprite renderer.
     *
     */
    destroy()
    {
        // detach event
        this._onBeforeRenderBinding.detach();
        this._onBeforeRenderBinding = null;

        // destroy vertex buffers
        for (let i = 0; i < this.vertexCount; ++i)
        {
            this.vertexBuffers[i].destroy();
            this.vaos[i].destroy();
        }

        // destroy index buffer
        if (this.indexBuffer)
        {
            this.indexBuffer.destroy();
        }

        // call parent destroy
        super.destroy();

        // destroy shaders
        for (let i = 0; i < this.shaders.length; ++i)
        {
            if (this.shaders[i])
            {
                this.shaders[i].destroy();
            }
        }

        // destroy buffers.
        for (let i = 0; i < this.buffers.length; ++i)
        {
            this.buffers[i].destroy();
        }

        // null references
        this.buffers = null;
        this._buffersMem = null;
        this.indices = null;
        this.shaders = null;
        this.groups = null;
        this.sprites = null;
        this.vertexBuffers = null;
        this.vaos = null;
        this.indexBuffer = null;
    }

    /**
     * Creates a new vertex buffer and VAO to manage it.
     *
     * @private
     * @param {!WebGLRenderingContext} gl - The rendering context.
     * @param {*} attribs - Attribute data for the shader.
     */
    _createVao(gl, attribs)
    {
        const vbuffer = glutil.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);

        this.vertexBuffers.push(vbuffer);

        // build the vao object that will render..
        this.vaos.push(
            this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vbuffer, attribs.aVertexPosition, false, this.vertByteSize, 0)
                .addAttribute(vbuffer, attribs.aTextureCoord, true, this.vertByteSize, 2 * 4)
                .addAttribute(vbuffer, attribs.aColor, true, this.vertByteSize, 3 * 4)
                .addAttribute(vbuffer, attribs.aTextureId, false, this.vertByteSize, 4 * 4)
        );
    }
}

function generateMultiTextureShader(gl, maxTextures)
{
    let fragSource = fragTemplate;

    fragSource = fragSource.replace(/\{\{count\}\}/gi, maxTextures);
    fragSource = fragSource.replace(/\{\{texture_choice\}\}/gi, generateSampleSrc(maxTextures));

    const shader = new Shader(gl, vertSource, fragSource);

    const sampleValues = [];

    for (let i = 0; i < maxTextures; ++i)
    {
        sampleValues[i] = i;
    }

    shader.bind();
    shader.uniforms.uSamplers = sampleValues;

    return shader;
}

function generateSampleSrc(maxTextures)
{
    let src = '\n\n';

    for (let i = 0; i < maxTextures; ++i)
    {
        if (i > 0) src += '\n    else';

        if (i < maxTextures - 1)
        {
            src += `    if(vTextureId == ${i}.0)`;
        }

        src += `\n    {\n        color = texture2D(uSamplers[${i}], vTextureCoord);\n    }`;
    }

    src += '\n\n';

    return src;
}

/**
 * Default batch size for the sprite renderer.
 *
 * @static
 * @constant
 * @memberof SpriteRenderer
 * @type {number}
 */
SpriteRenderer.DEFAULT_SPRITE_BATCH_SIZE = 4096;

/**
 * Default batch size for the sprite renderer.
 *
 * @static
 * @constant
 * @memberof SpriteRenderer
 * @type {number}
 */
SpriteRenderer.MAX_TEXTURE_COUNT = Device.tablet || Device.phone ? 2 : 32;

Renderer.registerObjectRenderer(SpriteRenderer);
