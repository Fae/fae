import System from './System';

// TODO: Sorting on add is incorrect, means z-index can never change
// after being added. Need to add a signal to transform about when
// z-index changes; listen for that and sort on change.

/**
 * @class
 */
export default class RenderSystem extends System {
    /**
     * @param {Renderer} renderer - The renderer to use.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = System.PRIORITY.RENDER, frequency = 1)
    {
        super(renderer, priority, frequency);
    }

    /**
     * Called when an entity is added to the system.
     *
     * @param {Entity} entity - The added entity.
     */
    enter(/* entity */)
    {
        this.entities.sort(compareZIndex);
    }
}

function compareZIndex(a, b)
{
    if (!b.transform || !a.transform) return 0;

    return a.transform.z - b.transform.z;
}
