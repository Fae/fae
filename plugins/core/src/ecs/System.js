import ECS from '@fae/ecs';

/**
 * @class
 */
export default class System extends ECS.System {
    /**
     *
     * @param {Renderer} renderer - The renderer this sytem belongs to.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = System.PRIORITY.USER, frequency = 1)
    {
        super(frequency);

        /**
         * The renderer to use.
         *
         * @member {Renderer}
         */
        this.renderer = renderer;

        /**
         * The priority of the system. A higher number makes it run
         * earlier.
         *
         * @member {number}
         */
        this.priority = priority;
    }

    /**
     * Destroys the system.
     *
     */
    destroy()
    {
        this.renderer = null;
    }
}

/**
 * Some common priority ranges. Higher priority numbers run first.
 * If you use these values directly it will run in the order:
 *
 * 1. USER
 * 2. PLUGIN
 * 3. RENDER
 *
 * @static
 * @constant
 * @property {number} USER - The user range (9000+)
 * @property {number} PLUGIN - The plugin range (5000-8999)
 * @property {number} RENDER - The render range (1000-4999)
 */
System.PRIORITY = {
    USER:   9000,
    PLUGIN: 5000,
    RENDER: 1000,
};
