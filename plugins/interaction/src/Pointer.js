// @ifdef DEBUG
import { debug } from '@fae/core';
// @endif

const EMPTY_ARRAY = [];

/**
 * @class
 */
export default class Pointer
{
    /**
     * @param {number} id - The id of the pointer.
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
         * The target of this pointer when it was pressed down.
         *
         * @readonly
         * @member {InteractableObject}
         */
        this.target = null;

        /**
         * The target of this pointer when it hovered over an object.
         *
         * @readonly
         * @member {InteractableObject}
         */
        this.hoverTarget = null;

        /**
         * The target of this pointer when scroll events happened.
         *
         * @readonly
         * @member {InteractableObject}
         */
        this.scrollTarget = null;

        /**
         * The unique identifier of the most recently pressed button.
         *
         * A value of `0` is also used for touch and "uninitialized" states.
         * For example, during a hover nothing is pressed. In this case this
         * value is `0`.
         *
         * @readonly
         * @member {number}
         */
        this.button = 0;

        /**
         * The unique identifiers of all the actively pressed buttons.
         *
         * @readonly
         * @member {number[]}
         */
        this.buttons = EMPTY_ARRAY;

        /**
         * A Boolean value indicating whether or not the alt key is pressed.
         *
         * @readonly
         * @member {boolean}
         */
        this.altKey = false;

        /**
         * A Boolean value indicating whether or not the control key is pressed.
         *
         * @readonly
         * @member {boolean}
         */
        this.ctrlKey = false;

        /**
         * A Boolean value indicating whether or not the meta key is pressed.
         *
         * @readonly
         * @member {boolean}
         */
        this.metaKey = false;

        /**
         * A Boolean value indicating whether or not the shift key is pressed.
         *
         * @readonly
         * @member {boolean}
         */
        this.shiftKey = false;

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
         * How much the pointer has moved since last time it was updated,
         * in world-space coords.
         *
         * @readonly
         * @member {number}
         */
        this.deltaX = 0;

        /**
         * How much the pointer has moved since last time it was updated,
         * in world-space coords.
         *
         * @readonly
         * @member {number}
         */
        this.deltaY = 0;

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
         * The delta X of the scroll when doing a scroll event.
         *
         * @readonly
         * @member {number}
         */
        this.scrollDeltaX = 0;

        /**
         * The delta Y of the scroll when doing a scroll event.
         *
         * @readonly
         * @member {number}
         */
        this.scrollDeltaY = 0;

        /**
         * The delta Z of the scroll when doing a scroll event.
         *
         * @readonly
         * @member {number}
         */
        this.scrollDeltaZ = 0;

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

    /**
     * Called on a start event.
     *
     * @param {MouseEvent|PointerEvent|Touch} data - The contact data.
     * @param {InteractableObject} target - The object this interaction hits.
     * @param {number} worldX - The world X coord of the interaction.
     * @param {number} worldY - The world Y coord of the interaction.
     */
    start(data, target, worldX, worldY)
    {
        // @ifdef DEBUG
        debug.ASSERT(!this.isDown, 'Start called for pointer without ending first.');
        // @endif

        this.isDown = true;
        this.target = target;

        this.button = data.button || 0;
        this.buttons = data.buttons || EMPTY_ARRAY;

        this._set(data, worldX, worldY);

        if (target)
        {
            target.onDown.dispatch(this, target);
        }
    }

    /**
     * Called on an end event.
     *
     * @param {MouseEvent|PointerEvent|Touch} data - The contact data.
     * @param {InteractableObject} target - The object this interaction hits.
     * @param {number} worldX - The world X coord of the interaction.
     * @param {number} worldY - The world Y coord of the interaction.
     */
    end(data, target, worldX, worldY)
    {
        // ignore end events when we haven't even started yet
        if (!this.isDown) return;

        this.isDown = false;

        this._set(data, worldX, worldY);

        // click!
        if (this.target)
        {
            if (this.target === target)
            {
                this.target.onClick.dispatch(this, this.target);
            }

            if (!target)
            {
                this.target.onUpOutside.dispatch(this, this.target);
            }
        }

        this.target = target;

        if (target)
        {
            target.onUp.dispatch(this, target);
        }
    }

    /**
     * Called on a move event.
     *
     * @param {MouseEvent|PointerEvent|Touch} data - The contact data.
     * @param {InteractableObject} target - The object this interaction hits.
     * @param {number} worldX - The world X coord of the interaction.
     * @param {number} worldY - The world Y coord of the interaction.
     */
    move(data, target, worldX, worldY)
    {
        this._set(data, worldX, worldY, this.isDown || this.isHovering);

        // target has changed, so hover state has changed
        if (this.hoverTarget !== target)
        {
            if (this.isHovering && this.hoverTarget)
            {
                this.isHovering = false;
                this.hoverTarget.onHoverEnd.dispatch(this, this.hoverTarget);
                this.hoverTarget = null;
            }

            if (target)
            {
                this.isHovering = true;
                this.hoverTarget = target;
                target.onHoverStart.dispatch(this, target);
            }
        }

        // TODO: Drag-and-drop, if you move mouse fast enough target changes. May
        // cause issues when people try to do dragging.

        this.hoverTarget = target;

        if (target)
        {
            target.onMove.dispatch(this, target);
        }
    }

    /**
     * Called on a cancel event.
     *
     * @param {MouseEvent|PointerEvent|Touch} data - The contact data.
     * @param {InteractableObject} target - The object this interaction hits.
     * @param {number} worldX - The world X coord of the interaction.
     * @param {number} worldY - The world Y coord of the interaction.
     */
    cancel(data, target, worldX, worldY)
    {
        const wasDown = this.isDown;
        const wasHovering = this.isHovering;

        this.isDown = false;
        this.isHovering = false;

        this._set(data, worldX, worldY);

        if (this.target)
        {
            this.target.onCancel.dispatch(this.target || this.hoverTarget, this);

            if (wasDown)
            {
                this.target.onUpOutside.dispatch(this, this.target);
            }
        }

        if (wasHovering && this.hoverTarget)
        {
            this.hoverTarget.onHoverEnd.dispatch(this, this.hoverTarget);
        }

        this.target = null;
        this.hoverTarget = null;
        this.scrollTarget = null;
    }

    /**
     * Called on a scroll event.
     *
     * @param {MouseEvent|PointerEvent|Touch} data - The contact data.
     * @param {InteractableObject} target - The object this interaction hits.
     * @param {number} worldX - The world X coord of the interaction.
     * @param {number} worldY - The world Y coord of the interaction.
     */
    scroll(data, target, worldX, worldY)
    {
        this._set(data, worldX, worldY);

        this.scrollDeltaX = data.deltaX;
        this.scrollDeltaY = data.deltaY;
        this.scrollDeltaZ = data.deltaZ;

        this.scrollTarget = target;

        if (target)
        {
            target.onScroll.dispatch(this, target);
        }
    }

    /**
     * Sets the members based on a DOM event.
     *
     * @param {PointerEvent|MouseEvent|Touch} data - The event data to set from.
     * @param {number} worldX - The world X coord of this event.
     * @param {number} worldY - The world Y coord of this event.
     * @param {boolean} calcDelta - Should we calculate the delta movement?
     */
    _set(data, worldX, worldY, calcDelta = false)
    {
        // set type
        if (data.pointerType)
        {
            this.type = data.pointerType;
        }
        else if (event.type && event.type[0] === 'm')
        {
            this.type = Pointer.TYPE.MOUSE;
        }
        else
        {
            this.type = Pointer.TYPE.TOUCH;
        }

        // set pressure
        if (typeof data.pressure === 'number')
        {
            this.pressure = data.pressure;
        }
        else if (typeof data.force === 'number')
        {
            this.pressure = data.force;
        }
        else
        {
            this.pressure = 1.0;
        }

        // set button state
        this.button = data.button || 0;
        this.buttons = data.buttons || EMPTY_ARRAY;

        // set key states
        this.altKey = data.altKey || false;
        this.ctrlKey = data.ctrlKey || false;
        this.metaKey = data.metaKey || false;
        this.shiftKey = data.shiftKey || false;

        // set size
        this.width = data.width || (typeof data.radiusX === 'number' ? data.radiusX * 2 : 1);
        this.height = data.height || (typeof data.radiusY === 'number' ? data.radiusY * 2 : 1);

        // set client x/y coords
        this.clientX = data.clientX;
        this.clientY = data.clientY;

        // calculate delta (maybe)
        this.deltaX = calcDelta ? (worldX - this.worldX) : 0;
        this.deltaY = calcDelta ? (worldY - this.worldY) : 0;

        // set world x/y coords
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
