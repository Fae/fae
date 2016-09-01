import ECS from '@fae/ecs';

/**
 * @class
 */
export default class Entity extends ECS.Entity {
    /**
     *
     */
    constructor()
    {
        super();

        /**
         * The render priority of this entity. A lower number will make it render
         * first. Think of this like a "z-index" the higher number will render on top.
         *
         * If you change this value at all after adding the entity to the renderer you will
         * need to call {@link Renderer#sortEntities} for the change to affect the sort.
         *
         * @member {number}
         * @default 0
         */
        this.renderPriority = 0;

        /**
         * An value that hints to the renderer how to group this entity to try and
         * improve batching. If this is set the renderer can group entities with the
         * same `priority` and `renderGroupHint` together, which may improve batching.
         *
         * While you can assign this value to anything you want, a good idea is to set
         * this to the ObjectRenderer class you know that entity will use. That way that
         * renderer can operate on those objects in sequence and potentially batch them.
         * If you don't know what to assign this to, leaving it as `null` is fine.
         *
         * If you change this value at all after adding the entity to the renderer you will
         * need to call {@link Renderer#sortEntities} for the change to affect the sort.
         *
         * @example
         *
         * ```js
         * import { ecs } from '@fae/core';
         * import { SpriteRenderer } from '@fae/sprites';
         *
         * class MySprite extends ecs.Entity.with(...)
         * {
         *     constructor()
         *     {
         *         super();
         *
         *         // When added to the renderer all `MySprite` instances with the same
         *         // priority will now be grouped together, improving the SpriteRenderer's
         *         // ability to batch them!
         *         this.renderGroupHint = SpriteRenderer;
         *     }
         * }
         * ```
         *
         * @member {*}
         * @default null
         */
        this.renderGroupHint = null;
    }
}
