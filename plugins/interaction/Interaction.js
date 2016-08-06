import { util /* @ifdef DEBUG */, debug /* @endif */ } from '@fae/core';
import Singal from 'mini-signals';
import Pointer from './Pointer';

/**
 * The Interaction class represents a single interaction in the system.
 *
 * @class
 */
export default class Interaction
{
    /**
     * @param {InteractableObject} target - The target of this interaction.
     * @param {InteractionManager} parent - The manager of this interaction.
     */
    constructor(target, parent)
    {
        /**
         * The target object that is being hit by these events.
         *
         * @readonly
         * @member {InteractableObject}
         */
        this.target = target;

        /**
         * The manager of this interaction.
         *
         * @readonly
         * @member {InteractionManager}
         */
        this.parent = parent;

        /**
         * The raw events this interaction deals with.
         *
         * @readonly
         * @member {MouseEvent|PointerEvent|TouchEvent}
         */
        this.lastEvent = null;

        /**
         * All the pointers that this interaction has dealt with.
         *
         * @readonly
         * @member {Pointer[]}
         */
        this.pointers = [];

        /**
         * Changed pointers. When we send this interaction to users, this list
         * is the list of pointers that were updated during that event.
         *
         * @readonly
         * @member {Pointer[]}
         */
        this.changedPointers = [];

        /**
         * Buffer for contacts that affect this interaction.
         * Used by calling `addContact()` repeatedly, then calling `processEvent()`.
         *
         * @private
         * @member {Pointer[]}
         */
        this._pointerBuffer = [];
    }

    /**
     * Add a touch to the internal buffer, to be processed when `processEvent` is called.
     *
     * @param {MouseEvent|PointerEvent|Touch} data - The event data of the contact.
     * @param {number} worldX - The X coord in world-space of this event.
     * @param {number} worldY - The Y coord in world-space of this event.
     */
    addContact(data, worldX, worldY)
    {
        const pointer = this._getPointer(data);

        pointer.setFromEventData(data, worldX, worldY);

        this._pointerBuffer.push(pointer);
    }

    /**
     * Adds an event to this interaction, which will modify the state of the interaction.
     *
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The event to process.
     */
    processEvent(event)
    {
        this.lastEvent = event;
        this.changedPointers.length = 0;

        // swap the pointer buffers so that _pointerBuffer is empty
        // and changedPointers has the contacts
        const temp = this._pointerBuffer;
        this._pointerBuffer = this.changedPointers;
        this.changedPointers = temp;

        // handle the event
        switch (Interaction.EVENT_STATE_MAP[event.type])
        {
            case Interaction.STATE.START:
                return this._handleStart(event);

            case Interaction.STATE.END:
                return this._handleEnd(event);

            case Interaction.STATE.MOVE:
                return this._handleMove(event);

            case Interaction.STATE.CANCEL:
                return this._handleCancel(event);

            case Interaction.STATE.SCROLL:
                return this._handleScroll(event);
        }

        return false;
    }

    /**
     * Prevents default on the most recent event object.
     *
     */
    preventDefault()
    {
        if (this.lastEvent)
        {
            this.lastEvent.preventDefault();
        }
    }

    /**
     * Gets or creates a pointer of ID/Type
     *
     * @private
     * @param {MouseEvent|PointerEvent|Touch} data - The event data of the contact.
     */
    _getPointer(data)
    {
        let pointerId = 0;

        if (typeof data.pointerId === 'number') pointerId = data.pointerId;
        else if (typeof data.identifier === 'number') pointerId = data.identifier;

        for (let i = 0; i < this.pointers.length; ++i)
        {
            if (this.pointers[i].id === id)
            {
                return this.pointers[i];
            }
        }

        return new Pointer(id);
    }

    /**
     * Handles a start event.
     *
     * @private
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The start event.
     * @return {boolean} True if the event was handled, false otherwise.
     */
    _handleStart(event)
    {
        // @ifdef DEBUG
        debug.ASSERT(!this.active, 'Got a start event while already active.');
        debug.ASSERT(!this.changedPointers.length, 'Got a start event with no changed pointers.');
        // @endif

        this.active = true;

        // each pointer needs to be marked as down
        for (let i = 0; i < this.changedPointers.length; ++i)
        {
            this.changedPointers[i].down = true;
        }
    }

    /**
     * Handles an end event.
     *
     * @private
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The end event.
     * @return {boolean} True if the event was handled, false otherwise.
     */
    _handleEnd(event)
    {
        if (this.active)
        {
            this.parent.onClick.dispatch(this);
        }

        this.active = false;

        // each pointer needs to be marked as not down
        for (let i = 0; i < this.changedPointers.length; ++i)
        {
            this.changedPointers[i].down = false;
        }
    }

    /**
     * Handles an end event.
     *
     * @private
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The move event.
     * @return {boolean} True if the event was handled, false otherwise.
     */
    _handleMove(event)
    {
        if (!this.active)
        {
            this.parent.onHoverStart
        }
        else
        {
        }
    }

    /**
     * Handles a cancel event.
     *
     * @private
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The cancel event.
     * @return {boolean} True if the event was handled, false otherwise.
     */
    _handleCancel(event)
    {
        this.active = false;

        // process cancel
    }

    /**
     * Handles a scroll event.
     *
     * @private
     * @param {MouseEvent} event - The scroll event.
     * @return {boolean} True if the event was handled, false otherwise.
     */
    _handleScroll(event)
    {
        // process scroll
    }
}

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
