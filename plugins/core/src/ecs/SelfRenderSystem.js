import System from './System';
import SelfRenderComponent from './SelfRenderComponent';

/**
 * @class
 */
export default class SelfRenderSystem extends System
{
    /**
     * Returns true if the entity is eligible to the system, false otherwise.
     *
     * @param {Entity} entity - The entity to test.
     * @return {boolean} True if entity should be included.
     */
    test(entity)
    {
        return entity.hasComponent(SelfRenderComponent);
    }

    /**
     * Tells the entity to render itself by calling the `render()` method with
     * the renderer and elapsed time.
     *
     * @param {Entity} entity - The entity to update.
     * @param {number} elapsed - The time elapsed since last update call.
     */
    update(entity, elapsed)
    {
        entity.render(this.renderer, elapsed);
    }
}
