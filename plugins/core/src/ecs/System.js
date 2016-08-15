import ECS from '@fae/ecs';

/**
 * @class
 */
export default class System extends ECS.System {
    /**
     *
     */
    constructor()
    {
        super();

        /**
         * The priority of the system. A higher number makes it run
         * earlier.
         *
         * @member {number}
         */
        this.priority = System.PRIORITY.USER;
    }
}

/**
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
