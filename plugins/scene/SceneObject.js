import Signal from 'mini-signals';
import { math } from '@fay/core';

/**
 * Base class for an object that has a transform in the scene.
 * This object's render methods are abstract.
 *
 * @class
 */
export default class SceneObject
{
    /**
     * Constructs a new SceneObject.
     */
    constructor()
    {
        /**
         * The transformation of the display object.
         *
         * @type {Transform}
         */
        this.transform = new math.Transform();

        /**
         * Is this object visible? When set to false, the object is not rendered.
         *
         * @type {boolean}
         * @default true
         */
        this.visible = true;

        /**
         * The alpha of the object when rendered.
         * 0 = transparent, 1 = opaque.
         *
         * @type {number}
         * @default 1
         */
        this.alpha = 1;

        /**
         * The world alpha of the object (local alpha * parent alpha).
         * 0 = transparent, 1 = opaque.
         *
         * @type {number}
         * @default 1
         */
        this.worldAlpha = 1;

        /**
         * The parent scene object this belongs to.
         *
         * @type {Container}
         */
        this.parent = null;

        /**
         * Dispatched in the update loop, each frame.
         *
         * @type {Signal}
         */
        this.onUpdate = new Signal();

        /**
         * Dispatched before the object is rendered.
         *
         * @type {Signal}
         */
        this.onPreRender = new Signal();

        /**
         * Dispatched after the object is rendered.
         *
         * @type {Signal}
         */
        this.onPostRender = new Signal();

        /**
         * Dispatched when this object is added to a new parent.
         *
         * The parameters passed handlers are:
         *
         * 1. {DisplayObject} parent - The parent it was added to.
         *
         * @type {Signal}
         */
        this.onAddedToParent = new Signal();

        /**
         * Dispatched when this object is removed from its parent.
         *
         * The parameters passed handlers are:
         *
         * 1. {DisplayObject} parent - The parent it was removed from.
         *
         * @type {Signal}
         */
        this.onRemovedFromParent = new Signal();
    }

    /**
     * Called for this object to render itself.
     *
     * @param {!Renderer} renderer - The renderer to render with.
     */
    render(/* renderer */)
    {
        /* Abstract */
    }

    /**
     * Destroys this display object.
     */
    destroy()
    {
        this.visible = false;

        this.transform.destroy();
        this.transform = null;

        this.parent = null;

        this.onUpdate.detachAll();
        this.onUpdate = null;

        this.onPreRender.detachAll();
        this.onPreRender = null;

        this.onPostRender.detachAll();
        this.onPostRender = null;

        this.onAddedToParent.detachAll();
        this.onAddedToParent = null;

        this.onRemovedFromParent.detachAll();
        this.onRemovedFromParent = null;
    }
}
