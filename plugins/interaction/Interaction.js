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
         * The type of interaction.
         *
         * @readonly
         * @member {Interaction.TYPE}
         */
        this.type = Interaction.TYPE.UNKNOWN;

        /**
         * The current state of the interaction, what is currently happening?
         *
         * @readonly
         * @member {Interaction.STATE}
         */
        this.state = Interaction.STATE.UNKNOWN;

        /**
         * Has this interaction ended?
         *
         * @readonly
         * @member {boolean}
         */
        this.ended = false;
    }

    /**
     * Adds an event to this interaction, which will modify the state of the interaction.
     *
     * @param {Event} event - The event to add.
     */
    addEvent(event)
    {
        this.events.push(event);

        // set the type on the first event.
        if (this.events.length === 1)
        {
            switch (event.type[0])
            {
                case 'm':
                    this.type = Interaction.TYPE.MOUSE;
                    break;

                case 't':
                    this.type = Interaction.TYPE.TOUCH;
                    break;

                case 'p':
                    this.type = Interaction.TYPE.POINTER;
                    break;
            }
        }

        // update state
        switch (event.type)
        {
            case 'mousedown':
            case 'touchstart':
            case 'pointerdown':
                this.state = Interaction.STATE.START;
                break;

            case 'mouseup':
            case 'touchend':
            case 'pointerup':
                this.state = Interaction.STATE.END;
                break;

            case 'mousemove':
            case 'touchmove':
            case 'pointermove':
                this.state = Interaction.STATE.MOVE;
                break;

            case 'mouseover':
            case 'pointerover':
                this.state = Interaction.STATE.OVER;
                break;

            case 'mouseout':
            case 'touchcancel':
            case 'pointerout':
                this.state = Interaction.STATE.CANCEL;
                break;

            case 'wheel':
                this.state = Interaction.STATE.SCROLL;
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
        this.type = Interaction.TYPE.UNKNOWN;
        this.state = Interaction.STATE.UNKNOWN;
        this.ended = false;
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
}

/**
 * The interaction type.
 *
 * @static
 * @readonly
 * @enum {number}
 */
Interaction.TYPE = {
    /** Unknown type */
    UNKNOWN: 0,
    /** The interaction is from a mouse */
    MOUSE: 1,
    /** The interaction is from a touch */
    TOUCH: 2,
    /** The interaction is from a generic pointer device */
    POINTER: 3,
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
    /** Over state (mouseover, or pointerover) */
    OVER: 4,
    /** Cancel state (mouseout, touchcancel, or pointerout) */
    CANCEL: 5,
    /** Scroll state (wheel) */
    SCROLL: 6,
};
