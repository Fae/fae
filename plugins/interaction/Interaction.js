import { util } from '@fae/core';

/**
 * The Interaction class represents a single interaction in the system.
 *
 * @class
 */
export default class Interaction
{
    /**
     * @param {InteractableObject} target - The target of this interaction.
     */
    constructor(target)
    {
        /**
         * The unique ID of this interaction, not necessarily sequential!
         *
         * @readonly
         * @member {number}
         */
        this.id = util.uid();

        /**
         * The target object that is being hit by these events.
         *
         * @readonly
         * @member {InteractableObject}
         */
        this.target = target;

        /**
         * The raw events this interaction deals with.
         *
         * @readonly
         * @member {Event[]}
         */
        this.events = [];

        /**
         * Pointer data.
         *
         * @readonly
         * @member {PointerData[]}
         */
        this.pointers = [];

        /**
         * Is this interaction active, or has the user ended the interaction?
         *
         * @readonly
         * @member {boolean}
         */
        this.active = false;
    }

    /**
     * Adds an event to this interaction, which will modify the state of the interaction.
     *
     * @param {Event} event - The event to add.
     * @param {boolean} hit - Was our target hit by this interaction?
     */
    addEvent(event, hit)
    {
        this.events.push(event);

        let eventPointerType = Interaction.POINTER_TYPE.UNKNOWN;

        switch (event.type[0])
        {
            case 'm':
                eventPointerType = Interaction.POINTER_TYPE.MOUSE;
                break;

            case 't':
                eventPointerType = Interaction.POINTER_TYPE.TOUCH;
                break;

            case 'p':
                eventPointerType = event.pointerType;
                break;
        }

        // update state
        switch (Interaction.EVENT_STATE_MAP[event.type])
        {
            case Interaction.STATE.START:
                this._handleStart(eventPointerType);
                break;

            case Interaction.STATE.END:
                this._handleEnd(eventPointerType);
                break;

            case Interaction.STATE.MOVE:
                this._handleMove(eventPointerType);
                break;

            case Interaction.STATE.CANCEL:
                this._handleCancel(eventPointerType);
                break;

            case Interaction.STATE.SCROLL:
                this._handleScroll(eventPointerType);
                break;
        }
    }

    /**
     * Resets the interaction to the empty state, re-assigns a new target and identifier.
     *
     * @param {InteractableObject} target - The target of this interaction.
     */
    reset(target)
    {
        this.id = util.uid();
        this.target = target;
        this.events.length = 0;
        this.pointers.length = 0;
    }

    /**
     * Prevents default on the most recent event object.
     */
    preventDefault()
    {
        const event = this.events[this.events.length - 1];

        if (event)
        {
            event.preventDefault();
        }
    }

    /**
     * Handles a start event.
     *
     * @private
     * @param {Interaction.POINTER_TYPE} pointerType - The pointer type that spawned this event.
     */
    _handleStart(pointerType)
    {
        this.active = true;

        // start up by adding a pointer?
    }

    /**
     * Handles an end event.
     *
     * @private
     * @param {Interaction.POINTER_TYPE} pointerType - The pointer type that spawned this event.
     */
    _handleEnd(pointerType)
    {
        if (this.active)
        {
            // click event
        }

        this.active = false;

        // process end
    }

    /**
     * Handles an end event.
     *
     * @private
     * @param {Interaction.POINTER_TYPE} pointerType - The pointer type that spawned this event.
     */
    _handleMove(pointerType)
    {
        // process move
    }

    /**
     * Handles a cancel event.
     *
     * @private
     * @param {Interaction.POINTER_TYPE} pointerType - The pointer type that spawned this event.
     */
    _handleCancel(pointerType)
    {
        this.active = false;

        // process cancel
    }

    /**
     * Handles a scroll event.
     *
     * @private
     * @param {Interaction.POINTER_TYPE} pointerType - The pointer type that spawned this event.
     */
    _handleScroll(pointerType)
    {
        // process scroll
    }
}

/**
 * The interaction type.
 *
 * @static
 * @readonly
 * @enum {string}
 */
Interaction.POINTER_TYPE = {
    /** Unknown type */
    UNKNOWN: '',
    /** The interaction is from a mouse */
    MOUSE: 'mouse',
    /** The interaction is from a touch */
    TOUCH: 'touch',
    /** The interaction is from a pen device */
    PEN: 'pen',
};

/**
 * The interaction state.
 *
 * @static
 * @readonly
 * @enum {number}
 */
Interaction.STATE = {
    /** Unknown state (nothing has happened) */
    UNKNOWN: 0,
    /** Start state (mousedown, touchstart, or pointerdown) */
    START: 1,
    /** Move state (mousemove, touchmove, or pointermove) */
    MOVE: 2,
    /** End state (mouseup, touchend, or pointerup) */
    END: 3,
    /** Hover state, over this element but not clicked */
    HOVER: 4,
    /** Cancel state (mouseout, touchcancel, or pointerout) */
    CANCEL: 5,
    /** Scroll state (wheel) */
    SCROLL: 6,
};

/**
 * Map of interaction events to the state they represent.
 *
 * @static
 * @readonly
 * @enum {string}
 */
Interaction.EVENT_STATE_MAP = {
    mousedown:      Interaction.STATE.START,
    touchstart:     Interaction.STATE.START,
    pointerdown:    Interaction.STATE.START,

    mouseup:        Interaction.STATE.END,
    touchend:       Interaction.STATE.END,
    pointerup:      Interaction.STATE.END,

    mousemove:      Interaction.STATE.MOVE,
    touchmove:      Interaction.STATE.MOVE,
    pointermove:    Interaction.STATE.MOVE,

    mouseout:       Interaction.STATE.CANCEL,
    touchcancel:    Interaction.STATE.CANCEL,
    pointerout:     Interaction.STATE.CANCEL,

    wheel:          Interaction.STATE.SCROLL,
};

/**
 * The interface for an object that can be added to the interaction manager.
 *
 * @interface InteractableObject
 */

/**
 * The type of the pointer
 *
 * @method
 * @name InteractableObject#hitTest
 * @param {number} x - The x coord to test.
 * @param {number} y - The y coord to test.
 * @return {InteractableObject} The hit object, or null if nothing hit.
 */
