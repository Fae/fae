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
         * @member {Transform}
         */
        this.transform = new math.Transform();

        /**
         * Is this object visible? When set to false, the object is not rendered.
         *
         * @member {boolean}
         * @default true
         */
        this.visible = true;

        /**
         * The alpha of the object when rendered.
         * 0 = transparent, 1 = opaque.
         *
         * @member {number}
         * @default 1
         */
        this.alpha = 1;

        /**
         * The world alpha of the object (local alpha * parent alpha).
         * 0 = transparent, 1 = opaque.
         *
         * @member {number}
         * @default 1
         */
        this.worldAlpha = 1;

        /**
         * The parent scene object this belongs to.
         *
         * @member {Container}
         */
        this.parent = null;

        /**
         * The bounding box of this scene object.
         *
         * @member {Rectangle}
         */
        this.boundingBox = new math.Rectangle();

        /**
         * Dispatched in the update loop, each frame.
         *
         * @member {Signal}
         */
        this.onUpdate = new Signal();

        /**
         * Dispatched before the object is rendered.
         *
         * @member {Signal}
         */
        this.onPreRender = new Signal();

        /**
         * Dispatched after the object is rendered.
         *
         * @member {Signal}
         */
        this.onPostRender = new Signal();

        /**
         * Dispatched when this object is added to a new parent.
         *
         * The parameters passed handlers are:
         *
         * 1. {DisplayObject} parent - The parent it was added to.
         *
         * @member {Signal}
         */
        this.onAddedToParent = new Signal();

        /**
         * Dispatched when this object is removed from its parent.
         *
         * The parameters passed handlers are:
         *
         * 1. {DisplayObject} parent - The parent it was removed from.
         *
         * @member {Signal}
         */
        this.onRemovedFromParent = new Signal();
    }

    /**
     * Updates the object properties to prepare it for rendering.
     *
     * - Multiply transform matrix by the parent matrix,
     * - Multiply local alpha by the parent world alpha,
     * - Update the boundingBox
     *
     * @return {boolean} True if the object was updated, false otherwise.
     */
    update()
    {
        if (!this.visible || !this.parent) return false;

        this.transform.update(this.parent.transform);

        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        this.boundingBox.x = this.transform.x;
        this.boundingBox.y = this.transform.y;

        return true;
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
     * Called to test if this object contains the passed in point.
     *
     * @param {number} x - The x coord to check.
     * @param {number} y - The y coord to check.
     * @return {SceneObject} The SceneObject that was hit, or null if nothing was.
     */
    hitTest(/* x, y */)
    {
        /* Abstract */
        return null;
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
