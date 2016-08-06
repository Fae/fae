/**
 * @class
 */
export default class Pointer
{
    /**
     * @param {number} id - The id of the pointer.
     * @param {Pointer.TYPE} type - The device type that generated this event.
     */
    constructor(id)
    {
        /**
         * The ID of this pointer.
         *
         * @readonly
         * @member {number}
         */
        this.id = id;

        /**
         * The type of this pointer.
         *
         * @readonly
         * @member {Pointer.TYPE}
         */
        this.type = Pointer.TYPE.UNKNOWN;

        /**
         * The target of this pointer.
         *
         * @readonly
         * @member {InteractableObject}
         */
        this.target = null;

        /**
         * The width of the interaction of the pointer with the screen.
         * For touch interactions, this is how much finger is on the screen.
         *
         * @readonly
         * @member {number}
         */
        this.width = 1;

        /**
         * The height of the interaction of the pointer with the screen.
         * For touch interactions, this is how much finger is on the screen.
         *
         * @readonly
         * @member {number}
         */
        this.height = 1;

        /**
         * The pressure or force of the interaction of the pointer with the screen.
         * This value is a normalized value between 0.0 and 1.0
         *
         * @readonly
         * @member {number}
         */
        this.pressure = 1.0;

        /**
         * How much the pointer has moved since last time it was updated.
         *
         * @readonly
         * @member {number}
         */
        this.deltaX = 0;

        /**
         * How much the pointer has moved since last time it was updated.
         *
         * @readonly
         * @member {number}
         */
        this.deltaY = 0;

        /**
         * The client-space coord of the pointer interaction.
         *
         * @readonly
         * @member {number}
         */
        this.clientX = 0;

        /**
         * The client-space coord of the pointer interaction.
         *
         * @readonly
         * @member {number}
         */
        this.clientY = 0;

        /**
         * The world-space coord of the pointer interaction.
         *
         * @readonly
         * @member {number}
         */
        this.worldX = 0;

        /**
         * The world-space coord of the pointer interaction.
         *
         * @readonly
         * @member {number}
         */
        this.worldY = 0;

        /**
         * Is this pointer down pressed down?
         *
         * @readonly
         * @member {boolean}
         */
        this.isDown = false;

        /**
         * Is this pointer hovering over the target?
         *
         * @readonly
         * @member {boolean}
         */
        this.isHovering = false;
    }

    start()
    {

    }

    end()
    {

    }

    move()
    {

    }

    cancel()
    {

    }

    scroll()
    {

    }

    /**
     * Sets the members based on a DOM event.
     *
     * @param {PointerEvent|MouseEvent|Touch} data - The event data to set from.
     */
    setupFromEventData(data, worldX, worldY)
    {
        if (data.pointerType)
            this.type = data.pointerType;
        else if (event.type && event.type[0] === 'm')
            this.type = Pointer.TYPE.MOUSE;
        else
            this.type = Pointer.TYPE.TOUCH;

        this.width = data.width || (typeof data.radiusX === 'number' ? data.radiusX * 2 : 1);
        this.height = data.height || (typeof data.radiusY === 'number' ? data.radiusY * 2 : 1);
        this.pressure = typeof data.pressure === 'number' ? data.pressure : (typeof data.force === 'number' ? data.force : 1.0);

        this.deltaX = this.empty ? 0 : (worldX - this.worldX);
        this.deltaY = this.empty ? 0 : (worldY - this.worldY);

        this.clientX = data.clientX;
        this.clientY = data.clientY;

        this.worldX = worldX;
        this.worldY = worldY;
    }
}

/**
 * The pointer type.
 *
 * @static
 * @readonly
 * @enum {string}
 */
Pointer.TYPE = {
    /** Unknown type */
    UNKNOWN: '',
    /** The pointer is a mouse */
    MOUSE: 'mouse',
    /** The pointer is a touch */
    TOUCH: 'touch',
    /** The pointer is a pen device */
    PEN: 'pen',
};

/**
 * Map of interaction events to the state they represent.
 *
 * @static
 * @readonly
 * @enum {string}
 */
Pointer.EVENT_CALL_MAP = {
    mousedown:      'start',
    touchstart:     'start',
    pointerdown:    'start',

    mouseup:        'end',
    touchend:       'end',
    pointerup:      'end',

    mousemove:      'move',
    touchmove:      'move',
    pointermove:    'move',

    mouseout:       'cancel',
    touchcancel:    'cancel',
    pointerout:     'cancel',

    wheel:          'scroll',
};
