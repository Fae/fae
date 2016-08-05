/**
 * @class
 */
export default class Pointer
{
    /**
     * @param {number} id - The id of the pointer.
     * @param {Interaction.POINTER_TYPE} type - The device type that generated this event.
     */
    constructor(id, type)
    {
        this.pointerId = id;

        this.width = 1;
        this.height = 1;
        this.pressure = 1;
        this.pointerType = type;
        this.isPrimary = true;
    }

    /**
     * @param {PointerEvent} event - The pointer event to build from
     */
    static fromPointerEvent(event)
    {

    }
}
