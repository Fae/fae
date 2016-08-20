import { ecs, render } from '@fae/core';
import TransformComponent from './TransformComponent';

// TODO: Transforms can have parents, but it is possible here to have
// a child's update() called first before the parent updates.
// Need to sort by parents in some efficient way.

/**
 * @class
 */
export default class TransformUpdateSystem extends ecs.System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = ecs.System.PRIORITY.PLUGIN, frequency = 1)
    {
        super(renderer, priority, frequency);
    }

    /**
     * Returns true if the entity is eligible to the system, false otherwise.
     *
     * @param {Entity} entity - The entity to test.
     * @return {boolean} True if entity should be included.
     */
    test(entity)
    {
        return entity.hasComponent(TransformComponent);
    }

    /**
     * Draw each sprite of this system.
     *
     */
    updateAll()
    {
        for (let i = 0; i < this.entities.length; ++i)
        {
            const ent = this.entities[i];

            ent.transform.update();
        }
    }
}

render.Renderer.addDefaultSystem(TransformUpdateSystem);
