import Renderer from '../render/Renderer';
import RenderSystem from './RenderSystem';
import SelfRenderComponent from './SelfRenderComponent';

/**
 * @class
 */
export default class SelfRenderSystem extends RenderSystem
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
     * Apply update to each entity of this system.
     *
     * @param {number} elapsed - The time elapsed since last update call.
     */
    updateAll(elapsed)
    {
        for (let i = 0; i < this.entities.length; ++i)
        {
            const entity = this.entities[i];

            entity.render(this.renderer, elapsed);
        }
    }
}
