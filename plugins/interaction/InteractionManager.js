import Interaction from './Interaction';
import Signal from 'mini-signals';

// @ifdef DEBUG
import { debug } from '@fae/core';
// @endif

const tempCoords = { x: 0, y: 0 };

/**
 * @class
 */
export default class InteractionManager
{
    /**
     * @param {HTMLCanvasElement} dom - The element to handle interactions on.
     *  Usually this is same element you are rendering to.
     */
    constructor(dom)
    {
        // @ifdef DEBUG
        const name = dom && dom.nodeName && dom.nodeName.toLowerCase();

        debug.ASSERT(name && name === 'canvas', 'InteractionManager requires a canvas to manage.');
        // @endif

        /**
         * The currently active interactions.
         *
         * @member {Interaction[]}
         */
        this.interactions = [];

        /**
         * The objects that can be interacted with.
         *
         * @member {InteractableObject[]}
         */
        this.objects = [];

        /**
         * The DOM element to consider interactions relative to.
         *
         * @member {HTMLCanvasElement}
         */
        this.domElement = dom;

        /**
         * Dispatched when an interaction occurs.
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onInteraction = new Signal();

        /**
         * Dispatched when a click occurs on an object.
         *
         * The callback looks like {@link InteractionManager.OnSingleInteractionCallback}
         *
         * @member {Signal}
         */
        this.onClick = new Signal();

        /**
         * Dispatched when a hover begins on an object.
         *
         * The callback looks like {@link InteractionManager.OnSingleInteractionCallback}
         *
         * @member {Signal}
         */
        this.OnHoverStart = new Signal();

        /**
         * Dispatched when a hover begins on an object.
         *
         * The callback looks like {@link InteractionManager.OnSingleInteractionCallback}
         *
         * @member {Signal}
         */
        this.OnHoverEnd = new Signal();

        /**
         * Pool of available interaction objects, so we dont have to recreate a bunch over time.
         *
         * @private
         * @member {Interaction[]}
         */
        this._interactionPool = [];

        // bound events use internally if needed
        this._boundHandleEvent = this.handleEvent.bind(this);

        /**
         * When an interaction occurs the interaction object is passed to the callback.
         *
         * @memberof InteractionManager
         * @callback OnInteractionCallback
         * @param {Interaction[]} interactions - The interactions that have been changed by this event.
         */

        /**
         * When an interaction occurs the interaction object is passed to the callback.
         *
         * @memberof InteractionManager
         * @callback OnSingleInteractionCallback
         * @param {Interaction} interaction - The interaction that has been changed by this event.
         */
    }

    /**
     * @param {InteractableObject} obj - The object to test for hits when input is received.
     */
    add(obj)
    {
        this.objects.push(obj);
    }

    /**
     * Converts client coords to world coords.
     *
     * @param {number} x - The x coord, in client space, to convert.
     * @param {number} y - The y coord, in client space, to convert.
     * @param {object} out - The out object to assign values to.
     * @param {number} out.x - The out X coord.
     * @param {number} out.y - The out Y coord.
     */
    convertClientToWorld(x, y, out = { x: 0, y: 0 })
    {
        const rect = this.domElement.getBoundingClientRect();

        out.x = ((x - rect.left) * (this.domElement.width / rect.width));
        out.y = ((y - rect.top) * (this.domElement.height / rect.height));

        return out;
    }

    /**
     * Hit tests the interactable objects and returns the first hit object. Takes
     * world-space coords.
     *
     * @param {number} x - The x coord, in world space, to test.
     * @param {number} y - The y coord, in world space, to test.
     * @return {InteractableObject} The object that was interacted with, null if nothing hits.
     */
    hitTest(x, y)
    {
        for (let i = 0; i < this.objects.length; ++i)
        {
            const pass = this.objects[i].hitTest(x, y);

            if (pass) return pass;
        }

        return null;
    }

    /**
     * Binds all the DOM events to the view passed in, defaulting to the renderer view.
     * If you don't want to manager DOM events on your own, this is a good option to
     * let the manager do it for you.
     *
     * @param {HTMLElement} view - The element to use as the root view.
     */
    bindEvents(view = this.domElement)
    {
        this.domElement = view;

        if (window.PointerEvent)
        {
            this.domElement.addEventListener('pointerdown', this._boundHandleEvent);
            this.domElement.addEventListener('pointerup', this._boundHandleEvent);
            this.domElement.addEventListener('pointermove', this._boundHandleEvent);
            this.domElement.addEventListener('pointerout', this._boundHandleEvent);
        }
        else
        {
            this.domElement.addEventListener('mousedown', this._boundHandleEvent);
            this.domElement.addEventListener('mouseup', this._boundHandleEvent);
            this.domElement.addEventListener('mousemove', this._boundHandleEvent);
            this.domElement.addEventListener('mouseout', this._boundHandleEvent);

            this.domElement.addEventListener('touchstart', this._boundHandleEvent);
            this.domElement.addEventListener('touchmove', this._boundHandleEvent);
            this.domElement.addEventListener('touchend', this._boundHandleEvent);
            this.domElement.addEventListener('touchcancel', this._boundHandleEvent);
        }

        this.domElement.addEventListener('wheel', this._boundHandleEvent);
    }

    /**
     * Unbinds all the DOM events.
     *
     */
    unbindEvents()
    {
        if (window.PointerEvent)
        {
            this.domElement.removeEventListener('pointerdown', this._boundHandleEvent);
            this.domElement.removeEventListener('pointerup', this._boundHandleEvent);
            this.domElement.removeEventListener('pointermove', this._boundHandleEvent);
            this.domElement.removeEventListener('pointerout', this._boundHandleEvent);
        }
        else
        {
            this.domElement.removeEventListener('mousedown', this._boundHandleEvent);
            this.domElement.removeEventListener('mouseup', this._boundHandleEvent);
            this.domElement.removeEventListener('mousemove', this._boundHandleEvent);
            this.domElement.removeEventListener('mouseout', this._boundHandleEvent);

            this.domElement.removeEventListener('touchstart', this._boundHandleEvent);
            this.domElement.removeEventListener('touchend', this._boundHandleEvent);
            this.domElement.removeEventListener('touchmove', this._boundHandleEvent);
            this.domElement.removeEventListener('touchcancel', this._boundHandleEvent);
        }

        this.domElement.removeEventListener('wheel', this._boundHandleEvent);
    }

    /**
     * Handles an interaction event, usually this is passed a DOM Event.
     *
     * @param {Event} event - The start event.
     */
    handleEvent(event)
    {
        const changedInteractions = [];

        // add contacts from the event to the interaction
        if (event.changedTouches)
        {
            for (let i = 0; i < event.changedTouches.length; ++i)
            {
                const touch = event.changedTouches;
                const pointer = this._getPointer(touch);
                const worldCoords = this.convertClientToWorld(data.clientX, data.clientY, tempCoords);
                const hitObject = this.hitTest(worldCoords.x, worldCoords.y);

                pointer[Pointer.EVENT_CALL_MAP[event.type]](touch, hitObject, worldX, worldY);
            }
        }
        else
        {
            const pointer = this._getPointer(touch);
            const worldCoords = this.convertClientToWorld(data.clientX, data.clientY, tempCoords);
            const hitObject = this.hitTest(worldCoords.x, worldCoords.y);

            pointer[Pointer.EVENT_CALL_MAP[event.type]](event, hitObject, worldX, worldY);
        }

        //////////////
        // TODO: Remove Interaction in favor of just using Pointer????
        /////////////

        // now process the event.

        // end and cancel event types need to go everywhere, so process the event on everything
        // and add ones that handle the event to the changed list.
        if (Interaction.EVENT_STATE_MAP[event.type] === Interaction.STATE.END
            || Interaction.EVENT_STATE_MAP[event.type] === Interaction.STATE.CANCEL)
        {
            for (let i = 0; i < this.interactions.length; ++i)
            {
                const interaction = this.interactions[i];

                if (interaction.processEvent(event))
                {
                    if (changedInteractions.indexOf(interaction) === -1)
                    {
                        changedInteractions.push(interaction);
                    }
                }
            }
        }
        // all other events only go to interactions that have been modified
        else
        {
            for (let i = 0; i < changedInteractions.length; ++i)
            {
                changedInteractions[i].processEvent(event);
            }
        }

        // if some interactions were effected, then dispatch the signal
        if (changedInteractions.length)
        {
            this.onInteraction.dispatch(changedInteractions);
        }
    }

    /**
     * Gets an interaction from the active list if the target has an active interaction
     * or creates a new one.
     *
     * @param {InteractableObject} target - The target for the interaction.
     * @return {Interaction} The interaction to use.
     */
    getInteraction(target, data)
    {
        // search for active interaction
        for (let i = 0; i < this.interactions.length; ++i)
        {
            if (this.interactions[i].target === target)
            {
                return this.interactions[i];
            }
        }

        // finally create a new one and add it as an active interaction
        const interaction = new Interaction(target, this);

        this.interactions.push(interaction);

        return interaction;
    }

    /**
     * Destroys this interaction manager.
     *
     */
    destroy()
    {
        this.unbindEvents();

        this.interactions = null;
        this.objects = null;
        this.domElement = null;

        this.onInteraction.detachAll();
        this.onInteraction = null;
    }

    /**
     * @private
     * @param {MouseEvent|PointerEvent|Touch} data - The contact data.
     */
    _handleInteraction(data)
    {
        const worldCoords = this.convertClientToWorld(data.clientX, data.clientY, tempCoords);
        const hitObject = this.hitTest(worldCoords.x, worldCoords.y);

        if (hitObject)
        {
            const interaction = this.getInteraction(hitObject);

            interaction.addContact(data, worldCoords.x, worldCoords.y);

            return interaction;
        }

        return null;
    }
}

/**
 * The interface for an object that can be added to the interaction manager.
 *
 * @interface InteractableObject
 */

/**
 * Checks if the object is "hit" by a point. It should return the "hit" object,
 * generally that is itself. If `true` is returned, then it is assumed the object
 * meant that it was hit itself. If a falsey values (`false`, `null`, etc) is
 * returned it is assumed that the object is not hit at all.
 *
 * @method
 * @name InteractableObject#hitTest
 * @param {number} x - The x coord to test.
 * @param {number} y - The y coord to test.
 * @return {InteractableObject} The hit object, or null if nothing hit.
 */
