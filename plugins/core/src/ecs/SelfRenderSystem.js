import System from './System';
import SelfRenderComponent from './SelfRenderComponent';
import Renderer from '../render/Renderer';

/**
 * @class
 * @memberof ecs
 */
export default class SelfRenderSystem extends System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = SelfRenderSystem.defaultPriority, frequency = 1)
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

Renderer.addDefaultSystem(SelfRenderSystem);

/**
 * @static
 * @constant
 * @member {number}
 * @default 1000
 */
SelfRenderSystem.defaultPriority = System.PRIORITY.RENDER;
