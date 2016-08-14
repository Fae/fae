import ECS from '@fae/ecs';
import SelfRenderComponent from './SelfRenderComponent';
import VisibilityComponent from './VisibilityComponent';

/**
 * @class
 */
export default class SelfRenderSystem extends ECS.System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     */
    constructor(renderer)
    {
        super();

        this.renderer = renderer;
    }

    /**
     * Returns true if the entity is eligible to the system, false otherwise.
     *
     * @param {Entity} entity - The entity to test.
     * @return {boolean} True if entity should be included.
     */
    test(entity)
    {
        return entity.hasComponents(
            SelfRenderComponent,
            VisibilityComponent
        );
    }

    /**
     * Called for each entity to update.
     *
     * @param {Entity} entity - The entity to update.
     */
    update(entity)
    {
        if (entity.visible)
        {
            entity.render(this.renderer);
        }
    }
}
