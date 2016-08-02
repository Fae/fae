import Interaction from './Interaction';
import Signal from 'mini-signals';
import { util } from '@fae/core';

/**
 * @class
 */
export default class InteractionManager
{
    /**
     * @param {Renderer} renderer - The renderer this interaction manager belongs to.
     *  Used to get the element we are rendering to for conversion of input event coords
     *  to world space coords.
     */
    constructor(renderer)
    {
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
        this.domElement = renderer.gl.canvas;

        /**
         * Dispatched when an interaction occurs.
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onInteraction = new Signal();

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
         * @param {Interaction} interaction - The interaction that has been modified.
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
     * Hit tests the interactable objects and returns the first hit object. Takes
     * screen-space coords and converts them into world-space before running the tests.
     *
     * @param {number} x - The x coord, in screen space, to test.
     * @param {number} y - The y coord, in screen space, to test.
     * @return {InteractableObject} The object that was interacted with, null if nothing hits.
     */
    hitTest(x, y)
    {
        const rect = this.domElement.getBoundingClientRect();

        x = ((x - rect.left) * (this.domElement.width / rect.width));
        y = ((y - rect.top) * (this.domElement.height / rect.height));

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

        // bind all the events.
        this.domElement.addEventListener('mousedown', this._boundHandleEvent);
        this.domElement.addEventListener('mouseup', this._boundHandleEvent);
        this.domElement.addEventListener('mousemove', this._boundHandleEvent);
        this.domElement.addEventListener('mouseover', this._boundHandleEvent);
        this.domElement.addEventListener('mouseout', this._boundHandleEvent);

        this.domElement.addEventListener('touchstart', this._boundHandleEvent);
        this.domElement.addEventListener('touchmove', this._boundHandleEvent);
        this.domElement.addEventListener('touchend', this._boundHandleEvent);
        this.domElement.addEventListener('touchcancel', this._boundHandleEvent);

        this.domElement.addEventListener('pointerdown', this._boundHandleEvent);
        this.domElement.addEventListener('pointerup', this._boundHandleEvent);
        this.domElement.addEventListener('pointermove', this._boundHandleEvent);
        this.domElement.addEventListener('pointerover', this._boundHandleEvent);
        this.domElement.addEventListener('pointerout', this._boundHandleEvent);

        this.domElement.addEventListener('wheel', this._boundHandleEvent);
    }

    /**
     * Unbinds all the DOM events.
     *
     */
    unbindEvents()
    {
        // bind all the events.
        this.domElement.removeEventListener('mousedown', this._boundHandleEvent);
        this.domElement.removeEventListener('mouseup', this._boundHandleEvent);
        this.domElement.removeEventListener('mousemove', this._boundHandleEvent);
        this.domElement.removeEventListener('mouseover', this._boundHandleEvent);
        this.domElement.removeEventListener('mouseout', this._boundHandleEvent);

        this.domElement.removeEventListener('touchstart', this._boundHandleEvent);
        this.domElement.removeEventListener('touchend', this._boundHandleEvent);
        this.domElement.removeEventListener('touchmove', this._boundHandleEvent);
        this.domElement.removeEventListener('touchcancel', this._boundHandleEvent);

        this.domElement.removeEventListener('pointerdown', this._boundHandleEvent);
        this.domElement.removeEventListener('pointerup', this._boundHandleEvent);
        this.domElement.removeEventListener('pointermove', this._boundHandleEvent);
        this.domElement.removeEventListener('pointerover', this._boundHandleEvent);
        this.domElement.removeEventListener('pointerout', this._boundHandleEvent);

        this.domElement.removeEventListener('wheel', this._boundHandleEvent);
    }

    /**
     * Handles an interaction event, usually this is passed a DOM Event.
     *
     * @param {Event} event - The start event.
     */
    handleEvent(event)
    {
        if (event.changedTouches)
        {
            for (let i = 0; i < event.changedTouches.length; ++i)
            {
                this._handleInteraction(event, event.changedTouches[i]);
            }
        }
        else
        {
            this._handleInteraction(event);
        }
    }

    /**
     * Destroys this interaction manager.
     *
     */
    destroy()
    {
        this.unbindEvents();

        this.interactions
        this.objects = null;
        this.domElement = null;
    }

    _handleInteraction(event, data = event)
    {
        const hit = this.hitTest(data.clientX, data.clientY);

        if (!hit) return;

        const interaction = this._getInteraction(hit);

        interaction.addEvent(event);

        this.onInteraction.dispatch(interaction);
    }

    /**
     * Gets an interaction from the active list if the target has an active interaction,
     * the pool or creates a new one.
     *
     * @private
     * @param {InteractableObject} target - The target for the interaction.
     */
    _getInteraction(target)
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
        const interaction = new Interaction(target);

        this.interactions.push(interaction);

        return interaction;
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
