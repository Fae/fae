/**
 * A helper class for managing a bitset of flags.
 *
 * @class
 * @memberof util
 */
export default class Flags
{
    /**
     * @param {number} initialValue - The starting value of the data.
     */
    constructor(initialValue = 0)
    {
        /**
         * The value of the flags underlying number.
         *
         * @member {number}
         */
        this.value = initialValue | 0;
    }

    /**
     * Sets the bits masked by `flag`.
     *
     * @param {number} flag - The bits to set.
     * @param {boolean} on - Whether to set or clear the bits.
     */
    set(flag, on = true)
    {
        if (on) this.value |= flag;
        else this.clear(flag);
    }

    /**
     * Clears the bits masked by `flag`.
     *
     * @param {number} flag - The bits to clear.
     */
    clear(flag)
    {
        this.value &= ~flag;
    }

    /**
     * Checks if the flag is set to the value.
     *
     * @param {number} flag - The bits to check.
     * @param {boolean} on - Whether to check on or off.
     * @return {boolean} True if it is the pased value, false otherwise.
     */
    is(flag, on)
    {
        return on ? this.isSet(flag) : this.isUnset(flag);
    }

    /**
     * Checks if the flag is set.
     *
     * @param {number} flag - The bits to check.
     * @return {boolean} True if it is set, false otherwise.
     */
    isSet(flag)
    {
        return (this.value & flag) !== 0;
    }

    /**
     * Checks if the flag is unset.
     *
     * @param {number} flag - The bits to check.
     * @return {boolean} True if it is unset, false otherwise.
     */
    isUnset(flag)
    {
        return (this.value & flag) === 0;
    }

    /**
     * Copies the values from another Flags object into this one.
     *
     * @param {Flags} flags - The object to copy from.
     * @return {Flags} Returns itself.
     */
    copy(flags)
    {
        this.value = flags.value;

        return this;
    }

    /**
     * Creates a new flags helper from a default value.
     *
     * @return {Flags} The new object.
     */
    clone()
    {
        return new Flags(this.value);
    }
}

/**
 * Helper to create a bit-shifted flag.
 *
 * @static
 * @method
 * @memberof Flags
 * @param {number} n - The index of the flag.
 * @return {number} The flag value.
 */
Flags.F = (n) => (1 << n);
