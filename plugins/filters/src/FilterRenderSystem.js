import { ecs, render } from '@fae/core';
import FilterComponent from './FilterComponent';

/**
 * @class
 * @memberof filters
 */
export default class FilterRenderSystem extends ecs.System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = (ecs.System.PRIORITY.RENDER + 500), frequency = 1)
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
        return entity.hasComponent(FilterComponent);
    }

    /**
     * Render the entity using filtered rendering.
     *
     * @param {Entity} entity - The entity to update
     */
    update(entity)
    {
        // stop obj renderer
        this.renderer.activeObjectRenderer.stop();

        // process the filter stack
        const stack = FilterUtils.activeRenderStack;

        for (let i = 0; i < stack.length; ++i)
        {
            const previousState = i > 0 ? stack[i - 1] : null;
            const currentState = stack[i];

            // TODO: apply dem filtars
        }

        // start obj renderer
        this.renderer.activeObjectRenderer.start();
    }
}

render.Renderer.addDefaultSystem(FilterPrepareSystem);
