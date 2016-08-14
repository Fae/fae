// @ifdef DEBUG
import { ASSERT } from '../debug';
// @endif

/**
 * Simple ArrayBuffer wrapper that manages offsets and views into that buffer.
 *
 * @class
 */
export default class Buffer
 {
    /**
     * @param {Buffer|ArrayBuffer|SharedArrayBuffer|ArrayBufferView|number} parentBufferOrSize - A parent
     *  buffer to have views into, or a size to create a new buffer. If a number is passed
     *  as the first argument it is assumed to be size, and other arguments are ignored.
     * @param {number} offset - Offset in bytes this buffer starts at in the parent buffer.
     * @param {number} length - Length in bytes of this buffer.
     */
    constructor(parentBufferOrSize, offset = 0, length = -1)
    {
        // @ifdef DEBUG
        ASSERT(offset >= 0, 'Invalid offset, must be negative.');
        // @endif

        let _buffer = null;

        if (typeof parentBufferOrSize === 'number')
        {
            _buffer = new ArrayBuffer(parentBufferOrSize);
        }
        else if (parentBufferOrSize instanceof ArrayBuffer)
        {
            _buffer = parentBufferOrSize;
        }
        else
        {
            // @ifdef DEBUG
            ASSERT(parentBufferOrSize.buffer, 'No buffer in object passed as parent.');
            // @endif
            _buffer = parentBufferOrSize.buffer;
        }

        const bytesLength = length !== -1 ? length : (_buffer.byteLength - offset);
        const view32Length = length !== -1 ? length / 4 : ((_buffer.byteLength / 4) - (offset / 4));

        // @ifdef DEBUG
        ASSERT(offset + bytesLength <= _buffer.byteLength, 'Offset + length > size of memory buffer.');
        // @endif

        /**
         * Raw underlying ArrayBuffer. This is all the memory of the buffer,
         * NOT just the view it has (based on offset/length).
         *
         * @member {ArrayBuffer}
         */
        this.buffer = _buffer;

        /**
         * View on the data as a Uint8Array.
         *
         * @member {Uint8Array}
         */
        this.bytes = new Uint8Array(_buffer, offset, bytesLength);

        /**
         * View on the data as a Float32Array.
         *
         * @member {Float32Array}
         */
        this.float32View = new Float32Array(_buffer, offset, view32Length);

        /**
         * View on the data as a Uint32Array.
         *
         * @member {Uint32Array}
         */
        this.uint32View = new Uint32Array(_buffer, offset, view32Length);

        // for duck-typing
        this.__isBuffer = true;
    }

    /**
     * Determines if the passed object is a buffer.
     *
     * @param {*} b - Object to check.
     * @return {boolean} True if the object is Buffer, false otherwise.
     */
    static isBuffer(b)
    {
        return !!b.__isBuffer;
    }

    /**
     * Destroys the buffer.
     */
    destroy()
    {
        this.buffer = null;
        this.bytes = null;
        this.float32View = null;
        this.uint32View = null;
    }
 }
