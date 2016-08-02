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

        if (this.events.length > )

        // set the type on the first event.
        if (this.events.length === 1)
        {
            switch (event.type[0])
            {
                case 'm': this.type = Interaction.TYPE.MOUSE; break;
                case 't': this.type = Interaction.TYPE.TOUCH; break;
                case 'p': this.type = Interaction.TYPE.POINTER; break;
            }
        }

        // update state
        switch (event.type)
        {
            // mouse events
            case 'mousedown':
            case 'mouseup':
            case 'mousemove':
            case 'mouseover':
            case 'mouseout':

            // touch events
            case 'touchstart':
            case 'touchmove':
            case 'touchend':
            case 'touchcancel':

            // pointer events
            case 'pointerdown':
            case 'pointerup':
            case 'pointermove':
            case 'pointerover':
            case 'pointerout':

            // scrolling
            case 'wheel':
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
    /** Unknown state (nothing has happened) */
    START: 1,
    /** Unknown state (nothing has happened) */
    MOVE: 2,
    /** Unknown state (nothing has happened) */
    END: 3,
    /** Unknown state (nothing has happened) */
    CANCEL: 4,
    /** Unknown state (nothing has happened) */
    SCROLL: 5,
};
