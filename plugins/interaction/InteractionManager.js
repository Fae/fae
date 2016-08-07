import Signal from 'mini-signals';
import Pointer from './Pointer';

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
         * The currently active pointers.
         *
         * @member {Pointer[]}
         */
        this.pointers = [];

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
         * Dispatched when a pointer starts an interaction (mousedown, pointerdown, touchstart).
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onDown = new Signal();

        /**
         * Dispatched when a pointer ends an interaction (mouseup, pointerup, touchend).
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onUp = new Signal();

        /**
         * Dispatched when a pointer moves (mousemove, pointermove, touchmove).
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onMove = new Signal();

        /**
         * Dispatched when a pointer cancels interaction (mouseout, pointerout, touchcancel).
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onCancel = new Signal();

        /**
         * Dispatched when a pointer has a scroll interaction (wheel).
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onScroll = new Signal();

        /**
         * Dispatched when a click occurs on an object.
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.onClick = new Signal();

        /**
         * Dispatched when a hover begins on an object.
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.OnHoverStart = new Signal();

        /**
         * Dispatched when a hover begins on an object.
         *
         * The callback looks like {@link InteractionManager.OnInteractionCallback}
         *
         * @member {Signal}
         */
        this.OnHoverEnd = new Signal();

        // bound events use internally if needed
        this._boundHandleEvent = this.handleEvent.bind(this);

        /**
         * When an interaction occurs the interaction object is passed to the callback.
         *
         * @memberof InteractionManager
         * @callback OnInteractionCallback
         * @param {InteractableObject} target - The target of the interaction.
         * @param {Pointer} pointer - The pointer the interaction happened on.
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
     * @return {object} An object with x/y properties.
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
            this.domElement.addEventListener('pointermove', this._boundHandleEvent);
            this.domElement.addEventListener('pointerout', this._boundHandleEvent);
            window.addEventListener('pointerup', this._boundHandleEvent);
        }
        else
        {
            this.domElement.addEventListener('mousedown', this._boundHandleEvent);
            this.domElement.addEventListener('mousemove', this._boundHandleEvent);
            this.domElement.addEventListener('mouseout', this._boundHandleEvent);
            window.addEventListener('mouseup', this._boundHandleEvent);

            this.domElement.addEventListener('touchstart', this._boundHandleEvent);
            this.domElement.addEventListener('touchmove', this._boundHandleEvent);
            this.domElement.addEventListener('touchcancel', this._boundHandleEvent);
            window.addEventListener('touchend', this._boundHandleEvent);
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
            this.domElement.removeEventListener('pointermove', this._boundHandleEvent);
            this.domElement.removeEventListener('pointerout', this._boundHandleEvent);
            window.removeEventListener('pointerup', this._boundHandleEvent);
        }
        else
        {
            this.domElement.removeEventListener('mousedown', this._boundHandleEvent);
            this.domElement.removeEventListener('mousemove', this._boundHandleEvent);
            this.domElement.removeEventListener('mouseout', this._boundHandleEvent);
            window.removeEventListener('mouseup', this._boundHandleEvent);

            this.domElement.removeEventListener('touchstart', this._boundHandleEvent);
            this.domElement.removeEventListener('touchmove', this._boundHandleEvent);
            this.domElement.removeEventListener('touchcancel', this._boundHandleEvent);
            window.removeEventListener('touchend', this._boundHandleEvent);
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
        // add contacts from the event to the interaction
        if (event.changedTouches)
        {
            for (let i = 0; i < event.changedTouches.length; ++i)
            {
                const touch = event.changedTouches;
                const pointer = this._getPointer(touch);
                const worldCoords = this.convertClientToWorld(touch.clientX, touch.clientY, tempCoords);
                const hitObject = this.hitTest(worldCoords.x, worldCoords.y);

                pointer[Pointer.EVENT_CALL_MAP[event.type]](touch, hitObject, worldCoords.x, worldCoords.y);
            }
        }
        else
        {
            const pointer = this._getPointer(event);
            const worldCoords = this.convertClientToWorld(event.clientX, event.clientY, tempCoords);
            const hitObject = this.hitTest(worldCoords.x, worldCoords.y);

            pointer[Pointer.EVENT_CALL_MAP[event.type]](event, hitObject, worldCoords.x, worldCoords.y);
        }
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
     * Gets or creates a pointer of ID/Type
     *
     * @private
     * @param {MouseEvent|PointerEvent|Touch} data - The event data of the contact.
     * @return {Pointer} The pointer to use.
     */
    _getPointer(data)
    {
        let pointerId = 0;

        if (typeof data.pointerId === 'number') pointerId = data.pointerId;
        else if (typeof data.identifier === 'number') pointerId = data.identifier;

        for (let i = 0; i < this.pointers.length; ++i)
        {
            if (this.pointers[i].id === pointerId)
            {
                return this.pointers[i];
            }
        }

        return new Pointer(pointerId);
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
