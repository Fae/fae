import Signal from 'mini-signals';
import SceneObject from './SceneObject';
import { util/* @ifdef DEBUG */, debug/* @endif */ } from '@fae/core';

/**
 * A Container is a SceneObject that has children. It overrides
 * the necessary methods to ensure that actions (like update, render, etc)
 * call the children. This is the main class that makes it possible to have
 * a tree of SceneObjects.
 *
 * @class
 */
export default class Container extends SceneObject
{
    /**
     * Creates a new Container
     */
    constructor()
    {
        super();

        /**
         * children of this container
         *
         * @type {SceneObject[]}
         */
        this.children = [];

        /**
         * Dispatched when the children array changes
         *
         * No params are passed to the callback.
         *
         * @type {Signal}
         */
        this.onChildrenChange = new Signal();
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

        for (let i = 0; i < this.children.length; ++i)
        {
            this.children[i].update();
        }

        this._boundsDirty = true;
    }

    /**
     * Called for this object to render itself. This render method only
     * renders children, but it does also call a protected `_render()`
     * method internally so that objects that extend Container can
     * render themselves if they want to.
     *
     * If you extend Container it is most likely you want to override
     * the `_render()` method to render yourself, and not this one.
     *
     * @param {!Renderer} renderer - The renderer to render with.
     */
    render(renderer)
    {
        // if the object is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.worldAlpha <= 0)
        {
            return;
        }

        this._render(renderer);

        for (let i = 0; i < this.children.length; ++i)
        {
            this.children[i].render(renderer);
        }
    }

    /**
     * Called to test if this object contains the passed in point.
     *
     * @param {number} x - The x coord to check.
     * @param {number} y - The y coord to check.
     * @return {SceneObject} The SceneObject that was hit, or null if nothing was.
     */
    hitTest(x, y)
    {
        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];
            const hit = child.hitTest(x, y);

            if (hit)
            {
                return hit;
            }
        }

        return null;
    }

    /**
     * Adds a child or multiple children to the container.
     *
     * @param {...SceneObject} child - The child, or children, to add.
     * @return {Container} returns itself.
     */
    addChild(...args)
    {
        // loop through the arguments and add all children
        for (let i = 0; i < args.length; ++i)
        {
            const child = args[i];

            // if the child has a parent then remove it as scene objects can only exist in one place.
            if (child.parent)
            {
                child.parent.removeChild(child);
            }

            child.parent = this;

            // ensure transform is recalculated
            child.transform.invalidate();

            this.children.push(child);

            this.onChildrenChange.dispatch();
            child.onAddedToParent.dispatch(this);
        }

        return this;
    }

    /**
     * Removes a child or multiple children from the container.
     *
     * @param {...SceneObject} child - The child, or children, to add.
     * @return {Container} returns itself.
     */
    removeChild(...args)
    {
        // if there is only one argument we can bypass looping through the them

        // loop through the arguments property and add all children
        // use it the right way (.length and [i]) so that this function can still be optimised by JS runtimes
        for (let i = 0; i < args.length; ++i)
        {
            const child = args[i];
            const index = this.children.indexOf(child);

            // @ifdef DEBUG
            debug.ASSERT(index !== -1, 'removeChild: passed object is not a child of this Container.');
            // @endif

            util.removeElements(this.children, index);
            child.parent = null;

            this.onChildrenChange.dispatch();
            child.onRemovedFromParent.dispatch(this);
        }

        return this;
    }

    /**
     * Destroys the container.
     *
     * @param {object|boolean} options - A boolean will act as if all options are set.
     * @param {boolean} [options.children=false] - If true all children will also be destroyed.
     * `options` is passed through to those calls.
     */
    destroy(options)
    {
        super.destroy(options);

        const destroyChildren = typeof options === 'boolean' ? options : options && options.children;

        if (destroyChildren)
        {
            for (let i = 0; i < this.children.length; ++i)
            {
                this.children[i].destroy(options);
            }
        }

        this.removeChildren();

        this.children = null;

        this.onChildrenChange.detachAll();
        this.onChildrenChange = null;
    }

    /**
     * Called internally for this object to render itself. This is only called
     * if the container is visible has a worldAlpha > 0. This method is here
     * to support objects that want to extend Container, but also have a visual.
     *
     * This allows the object to reuse the logic in Container for rendering children,
     * but also render itself.
     *
     * @protected
     * @param {!Renderer} renderer - The renderer to render with.
     */
    _render(/* renderer */)
    {
        /* Abstract */
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

        if (!this.visible) return;

        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            child._updateBounds();

            this._bounds.addChild(child._bounds);
        }
    }
}
