import { ecs } from '@fae/core';
import TransformComponent from './TransformComponent';

/**
 * @class
 */
export default class TransformUpdateSystem extends ecs.System
{
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
