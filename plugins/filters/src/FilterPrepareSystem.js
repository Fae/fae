import { ecs, render } from '@fae/core';
import FilterComponent from './FilterComponent';
import FilterUtils from './FilterUtils';

/**
 * @class
 * @memberof filters
 */
export default class FilterPrepareSystem extends ecs.System
{
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = (ecs.System.PRIORITY.PLUGIN + 500), frequency = 1)
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
     * Prepare the entity for filtered rendering.
     *
     * @param {Entity} entity - The entity to update
     */
    update(entity)
    {
        if (entity.filters.length === 0) return;

        // stop obj renderer
        this.renderer.activeObjectRenderer.stop();

        // reassign target and setup filter state
        FilterUtils.setup(entity, this.renderer);

        // start obj renderer
        this.renderer.activeObjectRenderer.start();
    }
}

render.Renderer.addDefaultSystem(FilterPrepareSystem);
