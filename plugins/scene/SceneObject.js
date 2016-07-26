import Signal from 'mini-signals';
import { math } from '@fae/core';

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
         * Dispatched when this object is added to a new parent.
         *
         * The callback looks like {@link SceneObject.OnAddedToParentCallback}
         *
         * @member {Signal}
         */
        this.onAddedToParent = new Signal();

        /**
         * Dispatched when this object is removed from its parent.
         *
         * The callback looks like {@link SceneObject.OnRemovedFromParentCallback}
         *
         * @member {Signal}
         */
        this.onRemovedFromParent = new Signal();

        /**
         * The bounding box of this scene object.
         *
         * @private
         * @member {BoundingBox}
         */
        this._bounds = new math.BoundingBox();

        /**
         * Tracker for if the bounds are dirty. Each time the object
         * is updated, the bounds are marked as dirty and recalculated
         * next time they are requested.
         *
         * @private
         * @member {boolean}
         */
        this._boundsDirty = true;

        /**
         * When added to a new parent, the parent is passed in the dispatch.
         *
         * @memberof SceneObject
         * @callback OnAddedToParentCallback
         * @param {SceneObject} parent - The parent it was added to.
         */

        /**
         * When removed from a parent, the parent is passed in the dispatch.
         *
         * @memberof SceneObject
         * @callback OnRemovedFromParentCallback
         * @param {SceneObject} parent - The parent it was added to.
         */
    }

    /**
     * Updates the object properties to prepare it for rendering.
     *
     * - Multiply transform matrix by the parent matrix,
     * - Multiply local alpha by the parent world alpha,
     * - Update the boundingBox
     */
    update()
    {
        if (!this.visible) return;

        const parent = this.parent || SceneObject.EMPTY;

        this.transform.update(parent.transform);
        this.worldAlpha = this.alpha * parent.worldAlpha;

        this._boundsDirty = true;
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
     * Returns the bounding box of this scene object. Since the bounding
     * box is calculated based on the objects transform matrix it is only
     * accurrate *after* calling `.update()`.
     *
     * For example:
     *
     * ```js
     * var obj = new SceneObject();
     *
     * obj.getBounds(); // 0, 0, 0, 0
     *
     * obj.transform.x += 10;
     *
     * obj.getBounds(); // 0, 0, 0, 0
     *
     * obj.update();
     *
     * obj.getBounds(); // 10, 0, 0, 0
     *
     * obj.transform.y += 20;
     *
     * obj.getBounds(); // 10, 0, 0, 0
     *
     * obj.update();
     *
     * obj.getBounds(); // 10, 20, 0, 0
     * ```
     *
     * @return {BoundingBox} The object's bounding box.
     *
     */
    getBounds()
    {
        if (this._boundsDirty)
        {
            this._updateBounds();
        }

        return this._bounds;
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

        this.onAddedToParent.detachAll();
        this.onAddedToParent = null;

        this.onRemovedFromParent.detachAll();
        this.onRemovedFromParent = null;

        this._bounds = null;
    }

    /**
     * Updates the bounds of this object.
     *
     * @protected
     */
    _updateBounds()
    {
        this._bounds.clear();
        this._boundsDirty = false;
    }
}

SceneObject.EMPTY = new SceneObject();
